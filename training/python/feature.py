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