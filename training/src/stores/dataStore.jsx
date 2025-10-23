import { create } from 'zustand';

export const useDataStore = create((set, get) => ({
    // this is just here for reference and will be overwritten anyway when loading a project
    sequenceClasses: [
        {
            name: "Negatives",
            symbolName: "",
            sequences: []
        }
    ],
    getSymbolName: (clsName) => {
        const seqClass = get().sequenceClasses.find((item) => item.name === clsName);
        if (seqClass == undefined) {
            return undefined;
        } 
        return seqClass.symbolName;
    },
    getSequenceCount: (clsName) => {
        const seqClass = get().sequenceClasses.find((item) => item.name === clsName);
        if (seqClass == undefined) {
            return undefined;
        } 
        return seqClass.sequences.length;
    },
    getSequence: (clsName, index) => {
        const seqClass = get().sequenceClasses.find((item) => item.name === clsName);
        if (seqClass == undefined) {
            return undefined;
        } 
        if (index < 0 || index >= seqClass.sequences.length) {
            return undefined;
        }
        return seqClass.sequences[index];
    },
    getFalsePositiveSequence: (clsName, index) => {
        const seqClass = get().sequenceClasses.find((item) => item.name === clsName);
        if (seqClass == undefined) {
            return undefined;
        } 
        if (seqClass.falsePositiveSequences == undefined) {
            return undefined;
        }
        if (index < 0 || index >= seqClass.falsePositiveSequences.length) {
            return undefined;
        }
        return seqClass.falsePositiveSequences[index];
    },
    // replace everything with newState (except actions)
    load: (newState) => {
        set(() => (
            { sequenceClasses: newState.sequenceClasses }
        ));
    },
    addSequenceClass: (clsName, symbolName, sequences) => {
        // name already taken?
        if (get().sequenceClasses.find((item) => item.name === clsName) !== undefined) {
            return { success: false, err: 'path name already taken' };
        }   
        set((state) => (
            { sequenceClasses: [...state.sequenceClasses, {
                name: clsName,
                symbolName: symbolName,
                sequences: sequences
            }] }
        ))
        return { success: true};
    },
    removeSequenceClass: (clsName) => (set((state) => (
        { sequenceClasses: [...state.sequenceClasses.filter((item) => item.name !== clsName)]}
    ))),
    updateSequenceClass: (oldName, newName, newSymbolName) => {
        if (oldName !== newName) {
            // name already taken?
            if (get().sequenceClasses.find((item) => item.name === newName) !== undefined) {
                alert('fail');
                return { success: false, err: 'path name already taken'};
            }
        }
        set((state) => (
            { sequenceClasses: state.sequenceClasses.map((item) => item.name === oldName ?
                {
                    name: newName,
                    symbolName: newSymbolName,
                    sequences: item.sequences
                } : item
            )}
        ))
        return { success: true };
    },
    addSequence: (clsName, newSequence) => {
        set((state) => {
            return { sequenceClasses: state.sequenceClasses.map((item) => item.name === clsName ?
                { ...item, sequences: [...item.sequences, newSequence] }
                : item
            )}
        });
    },
    removeSequence: (clsName, seqIndex) => (set((state) => (
        { sequenceClasses: state.sequenceClasses.map((item) => item.name === clsName ?
            { ...item, sequences: item.sequences.filter((_, i) => i !== seqIndex)}
            : item
        )}
    ))),
    removeLastSequence: (clsName) => (set((state) => (
        { sequenceClasses: state.sequenceClasses.map((item) => item.name === clsName ?
            { ...item, sequences: item.sequences.slice(0, -1)}
            : item
        )}
    ))),
    hasBeenTrained: (clsName) => {
        const seqClass = get().sequenceClasses.find((item) => item.name === clsName);
        if (seqClass == undefined) {
            return undefined;
        } 
        if (seqClass.weakLearner == undefined || seqClass.weakLearner.length === 0) {
            return false;
        }
        return true;
    }
}))