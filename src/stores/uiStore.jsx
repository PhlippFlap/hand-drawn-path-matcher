import { create } from 'zustand';

export const useUiStore = create((set) => ({
    mode: 'init',
    chosenSeqClassName: null,
    popup: null,
    editingPageMode: 'menu', // either 'menu', 'browse', 'edit', 'add'
    trainingPageMode: 'menu', // either 'menu', 'fineTune' or 'browseFalsePositives'
    
    setMode: (newMode) => (set(() => (
        { mode: newMode }
    ))),
    setChosenSeqClassName: (seqClsName) => (set(() => (
        { 
            chosenSeqClassName: seqClsName, 
            editingPageMode: 'menu' // Go back to menu when clicking on seqClass
        }
    ))),
    setPopup: (popup) => (set(() => (
        { popup: popup}
    ))),
    setEditingPageMode: (mode) => (set(() => (
        { editingPageMode: mode }
    ))),
    setTrainingPageMode: (mode) => (set(() => (
        { trainingPageMode: mode}
    )))
}));