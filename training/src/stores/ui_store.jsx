import { create } from 'zustand';

export const useUiStore = create((set) => ({
    mode: 'init',
    chosenSequenceClass: null,
    chosenSequence: null,

    setMode: (newMode) => (set((state) => (
        { mode: newMode }
    ))),
    setChosenSeqClass: (sequenceClass) => (set((state) => (
        { chosenSequenceClass: sequenceClass }
    ))),
    setChosenSeq: (sequence) => (set((state) => (
        { chosenSequence: sequence }
    ))),
}));