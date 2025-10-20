
import py5
import numpy as np
import math

class Sequence:
    def __init__(self, points: np.ndarray):
        self.points: list[np.ndarray] = points

    @staticmethod
    def from_float_list(points: list[float]):
        assert(len(points) % 2 == 0)
        # convert list of floats to list of 2 entry numpy arrays
        converted = []
        for i in range(0, len(points) - 2, 2):
            converted.append(np.array([points[i], points[i+1]]))
        return Sequence(converted)

    def copy(self):
        return Sequence(self.points[:])

    def show(self):
        py5.stroke(255)
        py5.fill(150)
        for i in range(len(self.points) - 1):
            c = self.points[i]
            n = self.points[i + 1]
            py5.line(c[0], c[1], n[0], n[1])
        for c in self.points:
            py5.ellipse(c[0], c[1], 5, 5)

    def show_transformed(self, offset_x, offset_y, width, height):
        py5.stroke(255)
        py5.fill(150)
        offset = np.array([offset_x + width / 2, offset_y + height / 2])
        scaling = np.array([width, height])
        for i in range(len(self.points) - 1):
            c = self.points[i] * scaling + offset
            n = self.points[i+1] * scaling + offset
            py5.line(c[0], c[1], n[0], n[1])
        for p in self.points:
            c = p * scaling + offset
            py5.ellipse(c[0], c[1], 2, 2)

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

    def traverse(self, start_point_index: int, amount: float):
        next_i = start_point_index + 1
        if next_i < len(self.points):
            c = self.points[next_i - 1]
            n = self.points[next_i]
            segment_length = np.linalg.norm(n - c)
            if segment_length == 0:
                return self.traverse(next_i, amount)
            if segment_length >= amount:
                mixing = amount / segment_length
                # print(f"mixing: {mixing} c: {c} n: {n} result: {mixing * c + (1 - mixing) * n}")
                return mixing * n + (1 - mixing) * c
            else:
                return self.traverse(next_i, amount - segment_length)
        else:
            return None

    # todo can be optimized
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
            prev = self.points[i-1]
            cur = self.points[i]
            nex = self.points[i+1]
            to_next = nex - cur
            to_next /= np.linalg.norm(to_next)
            to_cur = cur - prev
            distance = abs(to_next[0] * to_cur[1] - to_next[1] * to_cur[0])
            if distance < min_dist:
                min_dist = distance
                best_i = i
        self.points.pop(best_i)

    def decimate(self, target_point_count: int):
        while len(self.points) > target_point_count:
            self.decimation_step()