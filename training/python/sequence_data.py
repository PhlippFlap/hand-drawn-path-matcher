from sequence import Sequence
import numpy as np
from feature import Feature

# stores the decimated versions of the (normalized) input sequence
class SequenceData:
    # sequence is expected to be normalized
    def __init__(self, sequence: Sequence) -> None: 
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
