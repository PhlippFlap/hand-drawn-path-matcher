from feature import Feature
from sequence_data import SequenceData
import numpy as np

# Initialized with decimation level and start and end indices.
# When evaluated retrieves the vector p from the point with start index to the point with end index
# of the sequence at the given decimation level and evaluates if this point is in the Yes region or not.
# The Yes region is a circular region specified by the following parameters:
# - center_of_mass: center of the region
# - radius: radius of the region
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