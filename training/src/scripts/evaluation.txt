import numpy as np
import math
import json

NUM_POINTS = 20 # might be overwritten when loading json

# inspired by Haar-like features of the Viona Jones algorithm
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

# stores the decimated versions of the (normalized) input sequence
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

class WeakLearner: 
    def __init__(self, feature):
        self.feature: Feature = feature
        self.center_of_mass = np.zeros(2)
        self.radius = 0

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
        # list of weak learners. When evaluating these are tested one by one.
        # when all tests pass, evaluation is yes
        self.weak_learners = []

    # return true -> classified as in class
    def evaluate(self, sequence: SequenceData) -> bool:
        for w in self.weak_learners:
            if not w.evaluate(sequence):
                return False
        return True

def load_from_json(json_input_str) -> SequenceData:
    json_object: dict = json.loads(json_input_str)
    if "targetPointCount" in json_object: # defaults to 20 if not present
        global NUM_POINTS
        NUM_POINTS = json_object["targetPointCount"]
    # Read test sequence
    sequences_floats: list[float] = json_object["testSequence"]
    test_sequence = SequenceData(Sequence.from_float_list(sequences_floats), NUM_POINTS)
    # Read classes (to construct strong learners)
    classes_list: list = json_object["sequenceClasses"]
    classes: dict[str, StrongLearner] = {}
    for seq_class_dict in classes_list:
        name = seq_class_dict["name"]
        strong_learner = StrongLearner()
        weak_learner_list = seq_class_dict["weakLearner"]
        for weak_learner_dict in weak_learner_list:
            decimation_level= weak_learner_dict["decimationLevel"]
            start_index= weak_learner_dict["startIndex"]
            end_index = weak_learner_dict["endIndex"]
            center_of_mass_x = weak_learner_dict["centerOfMassX"]
            center_of_mass_y = weak_learner_dict["centerOfMassY"]
            radius = weak_learner_dict["radius"]
            weak_learner = WeakLearner(Feature(decimation_level, start_index, end_index))
            weak_learner.center_of_mass = np.array([center_of_mass_x, center_of_mass_y])
            weak_learner.radius = radius
            strong_learner.weak_learners.append(weak_learner)
        if len(strong_learner.weak_learners) > 0: # ignore untrained classes (and Negatives class)
            classes[name] = strong_learner
    return classes, test_sequence

# evaluation_result is either the class that was evaluated to or "" if no class matched
def store_to_json(evaluation_result: str): 
    json_object: dict = {}
    json_object["evaluationResult"] = evaluation_result
    return json.dumps(json_object, indent=2)

# -----------------------------------------------------
# This script is called by Pyodide with a global variable (JSON string) 'json_input_str' available
# Read input
learnerDict, testSequence = load_from_json(json_input_str) # type: ignore

# Evaluate
evaluation_result = ""
for class_name in learnerDict.keys():
    strong_learner = learnerDict[class_name]
    if strong_learner.evaluate(testSequence):
        evaluation_result = class_name
        break

# Write output: Prepare 'json_output_str' (JSON string) for Pyodide to read
json_output_str = store_to_json(evaluation_result)