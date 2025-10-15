import { create } from 'zustand';

export const useUiStore = create((set) => ({
    mode: 'init',
    chosenSeqClassName: null,

    setMode: (newMode) => (set((state) => (
        { mode: newMode }
    ))),
    setChosenSeqClassName: (seqClsName) => (set((state) => (
        { chosenSeqClassName: seqClsName }
    ))),
}));