import json
from sequence_data import SequenceData
from sequence_class import SequenceClass
from sequence import Sequence
from global_vars import NUM_POINTS

def load_from_json():
    try:
        with open('training/python/data.json') as f:
            json_object: dict = json.load(f)
            if "targetPointCount" in json_object: # defaults to 20 if not present
                global NUM_POINTS
                NUM_POINTS = json_object["targetPointCount"]
            if "maxWeakLearnerCount" in json_object: # defaults to 10 if not present
                global MAX_WEAK_LEARNER_COUNT
                MAX_WEAK_LEARNER_COUNT = json_object["maxWeakLearnerCount"]
            classes_list: list = json_object["sequenceClasses"]
            classes: list[SequenceClass] = []
            for seq_class_dict in classes_list:
                name = seq_class_dict["name"]
                symbolName = seq_class_dict["symbolName"]
                sequences_list = seq_class_dict["sequences"]
                sequences: list[Sequence] = []
                for s in sequences_list: # s is a list of floats representing a sequence
                    seq = Sequence.from_float_list(s) # convert to sequence
                    sequences.append(seq)
                classes.append(SequenceClass(name, symbolName, sequences))
            return classes
    except FileNotFoundError:
        print("File data.json not found.")
        return []
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []

def store_to_json(sequence_classes: list[SequenceClass]):
    json_object: dict = {}
    json_object["targetPointCount"] = NUM_POINTS
    classes_list: list = []
    for seq_class in sequence_classes:
        seq_class_dict: dict = {}
        seq_class_dict["name"] = seq_class.className
        seq_class_dict["symbolName"] = seq_class.symbolName
        sequences_list: list = []
        for s in seq_class.original_sequences:
            sequences_list.append(s.to_float_list())
        seq_class_dict["sequences"] = sequences_list
        if len(seq_class.weak_learners) > 0: # avoid storing empty list for Negatives
            weak_learner_list: list = []
            for i, weak_learner in enumerate(seq_class.weak_learners):
                weak_learner_dict: dict = {}
                weak_learner_dict["index"] = i
                weak_learner_dict["decimation_level"] = weak_learner.feature.decimation_level
                weak_learner_dict["start_index"] = weak_learner.feature.start_index
                weak_learner_dict["end_index"] = weak_learner.feature.end_index
                weak_learner_dict["center_of_mass_x"] = round(weak_learner.center_of_mass[0], 6)
                weak_learner_dict["center_of_mass_y"] = round(weak_learner.center_of_mass[1], 6)
                weak_learner_dict["radius"] = round(weak_learner.radius, 6)
                weak_learner_list.append(weak_learner_dict)
            seq_class_dict["weakLearners"] = weak_learner_list
        classes_list.append(seq_class_dict)
    json_object["sequenceClasses"] = classes_list
    with open('training/python/data.json', 'w') as f:
        json.dump(json_object, f, indent=2)
    

def test():
    print("Execute Test .............................")
    classes = load_from_json()
    for c in classes:
        print(f"Class: {c.className}, Symbol: {c.symbolName}, Num Sequences: {len(c.sequences)}")

# test()