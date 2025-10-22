import numpy as np
import py5
from sequence import Sequence
from sequence_data import SequenceData
from sequence_class import SequenceClass
from data_import import load_from_json
from algorithm2 import StrongLearner

points: list[float] = []
sequenceData: SequenceData | None = None
NUM_POINTS = 20
classes: SequenceClass = load_from_json()
strong_learner = StrongLearner()
strong_learner.train(classes[1].sequences, classes[0].sequences)
strong_learner.print_info()

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
        sequenceData.decimations[NUM_POINTS].show_transformed(0, 0, py5.width, py5.height)


def mouse_pressed():
    global sequenceData
    sequenceData = None

def mouse_released():
    # convert list of floats to list of 2 entry numpy arrays
    converted = []
    for i in range(0, len(points) - 2, 2):
        converted.append(np.array([points[i], points[i+1]]))

    # create sequence data
    global sequenceData
    sequence = Sequence(converted)
    if sequence.length() >= 1: # avoid devision by 0
        sequence.optimized_equi_space_out(NUM_POINTS)
        sequence.norm()
        sequenceData = SequenceData(sequence)
        # evaluate sequence
        print(f"Sequence is evaluated as: {strong_learner.evaluate(sequenceData)}")

    points.clear()

py5.run_sketch()
