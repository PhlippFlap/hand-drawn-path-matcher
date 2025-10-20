from sequence_data import SequenceData
from sequence_class import SequenceClass
from sequence import Sequence
from data_import import load_from_json
import py5
import numpy as np
from feature import Feature

classes = load_from_json()

def show_vectors(seq_class: SequenceClass, feature: Feature):
    for s in seq_class.sequences:
        seq = s.decimations[feature.decimation_level]
        vec = seq.points[feature.end_index] - seq.points[feature.start_index]
        py5.ellipse(vec[0] * py5.width/2 + py5.width/2, vec[1] * py5.height/2 + py5.height/2, 2, 2)

def setup():
    py5.size(500, 500)
    py5.stroke(255)

def draw():
    py5.background(20)
    # cross
    py5.stroke(50)
    py5.line(0, py5.height/2, py5.width, py5.height/2)
    py5.line(py5.width/2, 0, py5.width/2, py5.height)

    py5.no_stroke()
    py5.fill(200,20,30)
    show_vectors(classes[1], Feature(4, 0, 1))
    py5.fill(200,200,30)
    show_vectors(classes[1], Feature(4, 1, 2))
    py5.fill(30,20,200)
    show_vectors(classes[1], Feature(4, 2, 3))

def mouse_pressed():
    pass

def mouse_released():
    pass

py5.run_sketch()
