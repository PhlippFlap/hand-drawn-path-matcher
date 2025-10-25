import numpy as np
import math
import json

NUM_POINTS = 20
MAX_WEAK_LEARNER_COUNT = 10

class Feature:
    def __init__(self, 
        decimation_level,
        start_index,
        end_index
    ):
        self.decimation_level = decimation_level
        self.start_index = start_index
        self.end_index = end_index

class Sequence:
    def __init__(self, points: np.ndarray):
        self.points: list[np.ndarray] = points

    @staticmethod
    def from_float_list(points: list[float]):
        assert(len(points) % 2 == 0)
        # convert list of floats to list of 2 entry numpy arrays
        converted = []
        for i in range(0, len(points) - 1, 2):
            converted.append(np.array([points[i], points[i+1]]))
        return Sequence(converted)
    
    def to_float_list(self) -> list[float]:
        float_list = []
        for p in self.points:
            float_list.append(float(p[0]))
            float_list.append(float(p[1]))
        return float_list

    def copy(self):
        return Sequence(self.points[:])

    def center_of_mass(self) -> np.ndarray:
        c = np.zeros(2)
        for p in self.points:
            c += p
        return c / len(self.points)

    def variance(self) -> float:
        variance = 0
        for p in self.points:
            variance += np.dot(p,p)
        return math.sqrt(variance)

    def norm(self):
        c = self.center_of_mass()
        l = self.length()
        self.points = list(map(lambda p: (p - c) / l, self.points))
            
    def length(self):
        length = 0
        for i in range(1, len(self.points)):
            prev = self.points[i - 1]
            cur = self.points[i]
            length += np.linalg.norm(cur - prev)
        return length

    # assumes that sequence has non-zero length
    def optimized_equi_space_out(self, target_point_count: int):
        length = self.length()
        new_points = []
        spacing = length / (target_point_count - 1)
        cur_segment = 0
        space_needed = spacing
        cur_segment_progress = 0
        new_points.append(self.points[0]) # append first point
        run = True
        while run:
            c = self.points[cur_segment]
            n = self.points[cur_segment + 1]
            segment_length = np.linalg.norm(n - c)
            if segment_length == 0:
                cur_segment += 1
                continue
            if space_needed > segment_length - cur_segment_progress:
                # not enough space in the current segment to place next point
                space_needed -= segment_length - cur_segment_progress
                cur_segment += 1
                cur_segment_progress = 0
                continue
            while space_needed <= segment_length - cur_segment_progress:
                # enough space in the current segment to place next point
                cur_segment_progress += space_needed
                mixing = cur_segment_progress / segment_length
                new_points.append(mixing * n + (1 - mixing) * c) # place point
                if len(new_points) == target_point_count - 1: 
                    # this is the last point that should be placed like this
                    run = False
                    break
                space_needed = spacing
        new_points.append(self.points[len(self.points) - 1]) # append last point
        self.points = new_points

    def decimation_step(self):
        if len(self.points) < 3:
            return
        min_dist = 100000
        best_i = 1
        for i in range(1, len(self.points) - 1):
            prev = self.points[i-1]
            cur = self.points[i]
            nex = self.points[i+1]
            to_next = nex - cur
            ## to_next /= np.linalg.norm(to_next) # this normalization is not necessary since all segments have equal length
            to_cur = cur - prev
            distance = abs(to_next[0] * to_cur[1] - to_next[1] * to_cur[0])
            if distance < min_dist:
                min_dist = distance
                best_i = i
        self.points.pop(best_i)

class SequenceData:
    # consumes given sequences (changes it)
    def __init__(self, sequence: Sequence, target_point_count: int) -> None: 
        sequence.optimized_equi_space_out(target_point_count)
        sequence.norm()
        seqLen = len(sequence.points)
        self.decimations: dict[int, Sequence] = {}
        self.decimations[seqLen] = sequence
        # no need to store decimation for < 2 points
        for i in range(seqLen - 1, 1, -1):
            self.decimations[i] = self.decimations[i + 1].copy()
            self.decimations[i].decimation_step()

    def get_vector(self, feature: Feature) -> np.ndarray:
        seq = self.decimations[feature.decimation_level]
        return seq.points[feature.end_index] - seq.points[feature.start_index]

class SequenceClass:
    def __init__(self, className: str, original_sequences: list[Sequence]):
        self.className = className
        self.prepared_sequences: list[SequenceData] = list(map(lambda s: SequenceData(s, NUM_POINTS), original_sequences))
        self.weak_learners = []
        self.false_positives = []

class WeakLearner: 
    def __init__(self, feature):
        self.feature: Feature = feature
        self.center_of_mass = np.zeros(2)
        self.radius = 0

    def train(self, positive_sequences: list[SequenceData]):
        # compute vectors of positive sequences defined by feature
        train_vecs = list(map(lambda s: s.get_vector(self.feature), positive_sequences))

        # compute center of mass
        for v in train_vecs:
            self.center_of_mass += v
        self.center_of_mass /= len(train_vecs)

        # potentially use better estimate for this.
        # compute radius as max distances from center of mass to train vecs.
        for v in train_vecs:
            distance = np.linalg.norm(v - self.center_of_mass)
            if distance > self.radius:
                self.radius = distance

    def evaluate(self, sequence: SequenceData) -> bool:
        vec = sequence.get_vector(self.feature)
        vec -= self.center_of_mass
        return np.dot(vec, vec) <= self.radius * self.radius

# This is inspired by the Viola-Jones face detection algorithm.
# It uses cascading weak learners to form a strong learner.
# We use features consisting of vectors defined by two points in a decimated version of the sequence.
# This is similar to using Haar features in the Viola-Jones algorithm.
class StrongLearner:

    def __init__(self):
        # list of weak learner. When evaluating these are tested one by one.
        # when all tests pass, evaluation is yes
        self.weak_learners = []
        self.false_positives = []

    # possible improvement: rate weak learners better that use low decimation lvl in addition to performance    
    def train(self, positives: list[SequenceData], negatives: list[SequenceData]):
        left_negatives = negatives[:]
        for i in range(MAX_WEAK_LEARNER_COUNT):
            # find best weak learner until no more negatives can be rules out but at most 10.
            # rate weak learners according to how many negatives they rule out of those who are left (while keeping all positives by design).
            best_weak_learner = None
            most_negatives_ruled_out = 0

            weak_learners = self._generate_weak_learners(NUM_POINTS)
            for w in weak_learners:
                w.train(positives)
                ruled_out = 0
                for neg in left_negatives:
                    if not w.evaluate(neg):
                        ruled_out += 1
                if ruled_out > most_negatives_ruled_out:
                    most_negatives_ruled_out = ruled_out
                    best_weak_learner = w

            print(f"Round {i}: Best weak learner rules out {most_negatives_ruled_out} negatives.")

            if most_negatives_ruled_out == 0: 
                break # no more progress possible

            self.weak_learners.append(best_weak_learner)
            # remove ruled out negatives from left_negatives
            left_negatives = list(filter(lambda s: best_weak_learner.evaluate(s), left_negatives))
        self.false_positives = list(map(lambda s: s.decimations[NUM_POINTS], left_negatives)) # store with no decimation

    def _generate_weak_learners(self, point_count: int) -> list[WeakLearner]:
        weak_learners = []
        for decimation_level in range(2, point_count):
            # possible indices: 0 ... decimation_level - 1
            for start_index in range(0, decimation_level - 2):
                for end_index in range(start_index + 1, decimation_level - 1):
                    feature = Feature(decimation_level, start_index, end_index)
                    weak_learners.append(WeakLearner(feature))
        return weak_learners

    # return true -> classified as in class
    def evaluate(self, sequence: SequenceData) -> bool:
        for w in self.weak_learners:
            if not w.evaluate(sequence):
                return False
        return True
    
    def print_info(self):
        for i, w in enumerate(self.weak_learners):
            f = w.feature
            print(f"Weak Learner {i}: Decimation Level: {f.decimation_level}, Start Index: {f.start_index}, End Index: {f.end_index}, Center of Mass: {w.center_of_mass}, Radius: {w.radius}")

def train_all(negatives_seq_class, other_seq_classes: list[SequenceClass]):
    for i in range(len(other_seq_classes)):
        # train other_seq_classes[i]
        negative_classes = [negatives_seq_class] + other_seq_classes[:i] + other_seq_classes[i+1:]
        negative_sequences = sum(list(map(lambda c: c.prepared_sequences, negative_classes)), [])
        seq_class = other_seq_classes[i]
        if (len(seq_class.prepared_sequences) < 2): # require at least 2 positives
            print(f"Could not train class '{seq_class.className}' since there are not enough sequences!")
            continue
        print(f"Training class with name '{seq_class.className}' ...")
        strong_learner = StrongLearner()
        strong_learner.train(seq_class.prepared_sequences, negative_sequences)
        strong_learner.print_info()
        seq_class.weak_learners = strong_learner.weak_learners
        seq_class.false_positives = strong_learner.false_positives
    print("Training finished!")

def load_from_json(json_input_str) -> list[SequenceClass]:
    json_object: dict = json.loads(json_input_str)
    if "targetPointCount" in json_object: # defaults to 20 if not present
        global NUM_POINTS
        NUM_POINTS = json_object["targetPointCount"]
    if "maxWeakLearnerCount" in json_object: # defaults to 10 if not present
        global MAX_WEAK_LEARNER_COUNT
        MAX_WEAK_LEARNER_COUNT = json_object["maxWeakLearnerCount"]
    classes_list: list = json_object["sequenceClasses"]
    classes: list[SequenceClass] = []
    for seq_class_dict in classes_list:
        name = seq_class_dict["name"]
        sequences_list = seq_class_dict["sequences"]
        sequences: list[Sequence] = []
        for s in sequences_list: # s is a list of floats representing a sequence
            seq = Sequence.from_float_list(s) # convert to sequence
            sequences.append(seq)
        classes.append(SequenceClass(name, sequences))
    return classes

def store_to_json(sequence_classes: list[SequenceClass]) -> str:
    json_object: dict = {}
    json_object["targetPointCount"] = NUM_POINTS
    json_object["maxWeakLearnerCount"] = MAX_WEAK_LEARNER_COUNT
    classes_list: list = []
    for seq_class in sequence_classes:
        seq_class_dict: dict = {}
        seq_class_dict["name"] = seq_class.className
        if len(seq_class.weak_learners) > 0: # avoid storing empty list for Negatives
            weak_learner_list: list = []
            for i, weak_learner in enumerate(seq_class.weak_learners):
                weak_learner_dict: dict = {}
                weak_learner_dict["index"] = i
                weak_learner_dict["decimationLevel"] = weak_learner.feature.decimation_level
                weak_learner_dict["startIndex"] = weak_learner.feature.start_index
                weak_learner_dict["endIndex"] = weak_learner.feature.end_index
                weak_learner_dict["centerOfMassX"] = round(weak_learner.center_of_mass[0], 6)
                weak_learner_dict["centerOfMassY"] = round(weak_learner.center_of_mass[1], 6)
                weak_learner_dict["radius"] = round(weak_learner.radius, 6)
                weak_learner_list.append(weak_learner_dict)
            seq_class_dict["weakLearners"] = weak_learner_list
            # store false positives
            false_positives_list: list = []
            for false_positive_seq in seq_class.false_positives:
                false_positives_list.append(false_positive_seq.to_float_list())
            seq_class_dict["falsePositives"] = false_positives_list
        classes_list.append(seq_class_dict)
    json_object["sequenceClasses"] = classes_list
    return json.dumps(json_object, indent=2)

# -----------------------------------------------------
# This script is called by Pyodide with a global variable (JSON string) 'json_input_str' available
# Read input
classes = load_from_json(json_input_str) # type: ignore

# Train
assert classes[0].className == "Negatives"
if len(classes) > 1 and len(classes[0].prepared_sequences) > 1: # require 1 positive class and at least 1 negative
    train_all(classes[0], classes[1:])
else:
    print(f"Could not train since there are not enough positive or negative sequences!")
          
# Write output: Prepare 'json_output_str' (JSON string) for Pyodide to read
json_output_str = store_to_json(classes)