import json
from sequence_data import SequenceData
from sequence_class import SequenceClass
from sequence import Sequence

def load_from_json():
    try:
        with open('training/python/data.json') as f:
            json_object: dict = json.load(f)
            classes_list: list = json_object["sequenceClasses"]
            classes: list[SequenceClass] = []
            for seq_class_dict in classes_list:
                name = seq_class_dict["name"]
                symbolName = seq_class_dict["symbolName"]
                sequences_list = seq_class_dict["sequences"]
                sequences: list[SequenceData] = []
                for s in sequences_list: # s is a list of floats representing a sequence
                    # convert to sequence
                    seq = Sequence.from_float_list(s)
                    # normalize
                    seq.normalize(20) # todo use constant and rename norm()
                    # convert to SequenceData
                    sequences.append(SequenceData(seq))
                classes.append(SequenceClass(name, symbolName, sequences))
            return classes
    except FileNotFoundError:
        print("File data.json not found.")
        return []
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []

def test():
    print("Execute Test .............................")
    classes = load_from_json()
    for c in classes:
        print(f"Class: {c.className}, Symbol: {c.symbolName}, Num Sequences: {len(c.sequences)}")

test()