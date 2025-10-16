import { create } from 'zustand';

export const useUiStore = create((set) => ({
    mode: 'init',
    chosenSeqClassName: null,
    popup: null,

    setMode: (newMode) => (set(() => (
        { mode: newMode }
    ))),
    setChosenSeqClassName: (seqClsName) => (set(() => (
        { chosenSeqClassName: seqClsName }
    ))),
    setPopup: (popup) => (set(() => (
        { popup: popup}
    )))
}));