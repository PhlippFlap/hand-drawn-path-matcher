from sequence_class import SequenceClass
from strong_learner import StrongLearner

def train_all(negatives_seq_class, other_seq_classes: list[SequenceClass]):
    for i in range(len(other_seq_classes)):
        # train other_seq_classes[i]
        negative_classes = [negatives_seq_class] + other_seq_classes[:i] + other_seq_classes[i+1:]
        negative_sequences = sum(list(map(lambda c: c.prepared_sequences, negative_classes)), [])
        seq_class = other_seq_classes[i]
        print(f"Training class with name {seq_class.className} and symbol-name {seq_class.symbolName} ...")
        strong_learner = StrongLearner()
        strong_learner.train(seq_class.prepared_sequences, negative_sequences)
        strong_learner.print_info()
        seq_class.weak_learners = strong_learner.weak_learners
    print("Training finished!")