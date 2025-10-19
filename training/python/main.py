import numpy as np
import py5
import math

def transformed_point(point, offset_x, offset_y, scale_x, scale_y):
    x, y = point
    x = offset_x + scale_x * x
    y = offset_y + scale_y * y
    return x, y

class Sequence:
    def __init__(self, points):
        self.points: list[tuple[float, float]] = points

    def copy(self):
        return Sequence(self.points[:])

    def show(self):
        py5.stroke(255)
        py5.fill(150)
        for i in range(len(self.points) - 1):
            cx, cy = self.points[i]
            nx, ny = self.points[i + 1]
            py5.line(cx, cy, nx, ny)
        for x, y in self.points:
            py5.ellipse(x, y, 5, 5)

    def show_transformed(self, offset_x, offset_y, width, height):
        py5.stroke(255)
        py5.fill(150)
        offset_x = offset_x + width / 2
        offset_y = offset_y + height / 2
        scale_x = width * 1
        scale_y = height * 1
        for i in range(len(self.points) - 1):
            cx, cy = transformed_point(self.points[i], offset_x, offset_y, scale_x, scale_y)
            nx, ny = transformed_point(self.points[i + 1], offset_x, offset_y, scale_x, scale_y)
            py5.line(cx, cy, nx, ny)
        for x, y in self.points:
            x, y = transformed_point((x, y), offset_x, offset_y, scale_x, scale_y)
            py5.ellipse(x, y, 2, 2)

    def center_of_mass(self) -> tuple[float, float]:
        cx = 0
        cy = 0
        for (x, y) in self.points:
            cx += x
            cy += y
        cx /= len(self.points)
        cy /= len(self.points)
        return cx, cy

    def variance(self) -> float:
        variance = 0
        for (x, y) in self.points:
            variance += x * x + y * y
        return math.sqrt(variance)

    def norm(self):
        cx, cy = self.center_of_mass()
        for i, (x, y) in enumerate(self.points):
            x -= cx
            y -= cy
            self.points[int(i)] = (x, y)
        # v = self.variance()
        v = self.length()
        for i, (x, y) in enumerate(self.points):
            x /= v
            y /= v
            self.points[int(i)] = (x, y)

    def length(self):
        length = 0
        for i in range(1, len(self.points)):
            x1, y1 = self.points[i - 1]
            x2, y2 = self.points[i]
            dx = x1 - x2
            dy = y1 - y2
            length += math.sqrt(dx * dx + dy * dy)
        return length

    def traverse(self, start_point_index: int, amount: float):
        next_i = start_point_index + 1
        if next_i < len(self.points):
            cx, cy = self.points[next_i - 1]
            nx, ny = self.points[next_i]
            dx = cx - nx
            dy = cy - ny
            segment_length = math.sqrt(dx * dx + dy * dy)
            if segment_length == 0:
                return self.traverse(next_i, amount)
            if segment_length >= amount:
                mixing = amount / segment_length
                return nx * mixing + cx * (1 - mixing), ny * mixing + cy * (1 - mixing)
            else:
                return self.traverse(next_i, amount - segment_length)
        else:
            return None

    def equi_space_out(self, target_point_count: int):
        length = self.length()
        new_points = []
        spacing = length / (target_point_count - 1)
        for i in range(target_point_count - 1):
            p = self.traverse(0, spacing * i)
            if p is None:
                break  # should not happen
            new_points.append(p)
        new_points.append(self.points[len(self.points) - 1])  # add last point
        self.points = new_points

    def decimation_step(self):
        if len(self.points) < 3:
            return
        min_dist = 100000
        best_i = 1
        for i in range(1, len(self.points) - 1):
            last_x, last_y = self.points[i-1]
            next_x, next_y = self.points[i+1]
            cur_x, cur_y = self.points[i]
            dx = next_x - last_x
            dy = next_y - last_y
            dl = math.sqrt(dx*dx + dy*dy)
            dx /= dl
            dy /= dl
            to_cur_x = cur_x - last_x
            to_cur_y = cur_y - last_y
            d = abs(dx * to_cur_y - dy * to_cur_x)
            if d < min_dist:
                min_dist = d
                best_i = i
        self.points.pop(best_i)

    def decimate(self, target_point_count: int):
        while len(self.points) > target_point_count:
            self.decimation_step()

# stores the decimated versions of the (normalized) input sequence
class SequenceData:
    def __init__(self, sequence: Sequence) -> None:
        seqLen = len(sequence.points)
        self.decimations: dict[int, Sequence] = {}
        self.decimations[seqLen] = sequence
        # no need to store decimation for < 2 points
        for i in range(seqLen - 1, 1, -1):
            self.decimations[i] = self.decimations[i + 1].copy()
            self.decimations[i].decimation_step()
        
class SequenceClass:
    def __init__(self, className: str, symbolName: str, sequences: list[SequenceData]):
        self.className = className
        self.symbolName = symbolName
        self.sequences = sequences

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

    def _extract_vector(self, sequence: SequenceData):
        lvl = self.feature.decimation_level
        start = self.feature.start_index
        end = self.feature.end_index
        (sx, sy) = sequence.decimations[lvl][start] # start point
        (ex, ey) = sequence.decimations[lvl][end] # end point
        return (ex - sx, ey - sy) # direction from start to end

    def train(self, positive_sequences: list[SequenceData], negative_sequences: list[SequenceData]):
        # compute vectors of positive and negative sequences defined by feature
        positives = positive_sequences.map(lambda s: self._extract_vector(s))
        negatives = negative_sequences.map(lambda s: self._extract_vector(s))

        # compute (vx, vy)
        # This is chosen to be the normalized vector that maximizes sum_{p: positives} <p, v> = sum_{p: positives} p.x * vx + p.y * vy
        
        # compute l
        # l is chosen to be the length that minimizes the squared differences of it to all positive points.

        # compute a, b, bias
        weights, _, _, _ = np.linalg.lstsq(feature_mat, y_mat, rcond=None)

    # > 0 => Yes
    def evaluate(self, sequence: SequenceData) -> float:
        vec_x, vec_y = self._extract_vector(sequence)
        length = math.sqrt(vec_x^2 + vec_y^2)
        return self.a * (vec_x * self.vx + vec_y * self.vy) + self.b * (l - length)^2 + self.bias
        



points: list[float] = []
sequenceData: SequenceData | None = None
NUM_POINTS = 20

def setup():
    py5.size(500, 500)
    py5.stroke(255)

def draw():
    py5.background(20)

    # append points if mouse pressed 
    if py5.is_mouse_pressed:
        points.append(py5.mouse_x)
        points.append(py5.mouse_y)

    # draw points
    py5.fill(255, 173, 51)
    py5.stroke(255, 184, 77)
    for i in range(0, len(points) - 4, 2):
        py5.line(points[i], points[i+1], points[i+2], points[i+3])
    for i in range(0, len(points) - 2, 2):
        py5.ellipse(points[i], points[i+1], 5, 5)

    # draw sequence
    if (sequenceData != None):
        sequenceData.decimations[20].show_transformed(0, 0, py5.width, py5.height)


def mouse_pressed():
    global sequenceData
    sequenceData = None

def mouse_released():
    # convert list of floats to list of points
    converted = []
    for i in range(0, len(points) - 2, 2):
        converted.append((points[i], points[i+1]))

    # create sequence data
    global sequenceData
    sequence = Sequence(converted)
    sequence.equi_space_out(NUM_POINTS)
    sequence.norm()
    print(sequence.points)
    sequenceData = SequenceData(sequence)

    points.clear()

py5.run_sketch()
