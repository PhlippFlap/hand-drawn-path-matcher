
# Initialized with decimation level and start and end indices.
# When evaluated retrieves the vector p from the point with start index to the point with end index
# of the sequence at the given decimation level and evaluates if this point is in the Yes region or not.
# The Yes region is specified by the following 6 parameters:
# - dot product <p,v> between p and a vector v = (vx,vy) (2 parameters for the vector coordinates).
# - squared length difference (|p|-l)^2 to a length l (1 parameter).
# - weights a, b, bias for equation: a*<p,v> + b*(|p|-l)^2 + bias
# Yes-instance => equation > 0
# These parameters are computed from training set (positive and negative examples) such that they are optimal for that set
class WeakLearner: 
    def __init__(self, feature):
        self.feature: Feature = feature
        self.vx: float = 1
        self.vy: float = 0
        self.l: float = 1
        self.a: float = 0
        self.b: float = 0
        self.bias: float = 0

    def train(self, positive_sequences: list[SequenceData], negative_sequences: list[SequenceData]):
        lvl = self.feature.decimation_level
        start = self.feature.start_index
        end = self.feature.end_index

        def extract_vectors(sequences: list[SequenceData]):
            pass # todo

        # compute vectors of positive and negative sequences defined by feature
        positives = positive_sequences.map(lambda s: self._extract_vector(s))
        negatives = negative_sequences.map(lambda s: self._extract_vector(s))

        # compute (vx, vy)
        # This is chosen to be the normalized vector that maximizes sum_{p: positives} <norm(p), v> = sum_{p: positives} p.x * vx + p.y * vy
        # This equals 1/|{p:positives}| * sum_{p: positives} norm(p).
        
        # compute l
        # l is chosen to be the length that minimizes the squared differences of it to all positive points.

        # compute a, b, bias
        weights, _, _, _ = np.linalg.lstsq(feature_mat, y_mat, rcond=None)

    # > 0 => Yes
    def evaluate(self, sequence: SequenceData) -> float:
        vec_x, vec_y = self._extract_vector(sequence)
        length = math.sqrt(vec_x^2 + vec_y^2)
        return self.a * (vec_x * self.vx + vec_y * self.vy) + self.b * (l - length)^2 + self.bias
        