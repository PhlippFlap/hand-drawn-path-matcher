import numpy as np
from sequence import Sequence
from sequence_data import SequenceData
from sequence_class import SequenceClass
from feature import Feature

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

    # possible improvement: rate weak learners better that use low decimation lvl in addition to performance    
    def train(self, positives: list[SequenceData], negatives: list[SequenceData]):
        point_count = max(positives[0].decimations.keys()) # all sequences have the same number of points
        left_negatives = negatives[:]
        for i in range(10):
            # find best weak learner until no more negatives can be rules out but at most 10.
            # rate weak learners according to how many negatives they rule out of those who are left (while keeping all positives by design).
            best_weak_learner = None
            most_negatives_ruled_out = 0

            weak_learners = self._generate_weak_learners(point_count)
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
        print(f"Training class with name {seq_class.className} and symbol-name {seq_class.symbolName} ...")
        strong_learner = StrongLearner()
        strong_learner.train(seq_class.prepared_sequences, negative_sequences)
        strong_learner.print_info()
        seq_class.weak_learners = strong_learner.weak_learners
    print("Training finished!")