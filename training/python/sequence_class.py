from sequence_data import SequenceData

class SequenceClass:
    def __init__(self, className: str, symbolName: str, sequences: list[SequenceData]):
        self.className = className
        self.symbolName = symbolName
        self.sequences = sequences