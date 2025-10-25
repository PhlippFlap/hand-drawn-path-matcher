import numpy as np
import py5
from sequence import Sequence
from sequence_data import SequenceData
from sequence_class import SequenceClass
from data_io import load_from_json, store_to_json
from global_vars import NUM_POINTS
from strong_learner import StrongLearner
from algorithm import train_all

points: list[float] = []
sequenceData: SequenceData | None = None
classes: list[SequenceClass] = load_from_json()
assert classes[0].className == "Negatives"
train_all(classes[0], classes[1:])
store_to_json(classes)

strong_learner = StrongLearner()
strong_learner.train(classes[1].prepared_sequences, classes[0].prepared_sequences)
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
        sequenceData = SequenceData(sequence, NUM_POINTS)
        # evaluate sequence
        print(f"Sequence is evaluated as: {strong_learner.evaluate(sequenceData)}")

    points.clear()

py5.run_sketch()
