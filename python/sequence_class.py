from sequence_data import SequenceData
from sequence import Sequence
from global_vars import NUM_POINTS

class SequenceClass:
    def __init__(self, className: str, symbolName: str, original_sequences: list[Sequence]):
        self.className = className
        self.symbolName = symbolName
        self.original_sequences = [s.copy() for s in original_sequences]# have to copy sequences because they are changed when creating SequenceData objects
        self.prepared_sequences: list[SequenceData] = list(map(lambda s: SequenceData(s, NUM_POINTS), original_sequences))
        self.weak_learners = []