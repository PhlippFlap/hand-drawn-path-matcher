import { create } from 'zustand';

/*
export class SequenceClass {
    constructor (name, symbolName, sequences = []) {
        this.name = name;
        this.symbolName = symbolName;
        this.sequences = sequences;
    }

    copy () {
        return new SequenceClass(this.name, this.symbolName, [...this.sequences]);
    }

    addSequence(sequence) {
        const copy = this.copy();
        copy.sequences.push(sequence);
        return copy;
    }

    removeSequence(sequence) {
        const copy = this.copy();
        copy.sequences = copy.sequences.filter(s => s !== sequence);
        return copy;
    }

    update(name, symbolName) {
        const copy = this.copy();
        copy.name = name;
        copy.symbolName = symbolName;
        return copy;
    }
}

export class DataStore {
    constructor (sequenceClasses = []) {
        this.sequenceClasses = sequenceClasses;
        this.negativeSeqClass = new SequenceClass("Negatives", "");
    }

    existsName (sequenceClassName) {
        // return true when the name is reserved ("Negatives") or already exists
        return sequenceClassName === "Negatives" || this.sequenceClasses.find(c => c.name === sequenceClassName) !== undefined;
    }

    copy () {
        return new DataStore([...this.sequenceClasses]);
    }

    addSequenceClass(sequenceClass) {
        alert(sequenceClass.name);
        if (!existsName(sequenceClass.sequences)) {
            const copy = this.copy();
            copy.sequenceClasses.push(sequenceClass);
            return copy;
        }
        return this.copy();
    }

    removeSequenceClass(sequenceClass) {
        const copy = this.copy();
        copy.sequenceClasses = copy.sequenceClasses.filter(c => c !== sequenceClass);
        return copy;
    }

    setSequenceClass(oldClass, newClass) {
        const copy = this.copy();
        copy.sequenceClasses = copy.sequenceClasses.map(c => (c === oldClass ? newClass : c));
        return copy;
    }
}
*/

// Issue with this: this / existsName does not exists (class not working at all)
/*
export const useDataStore = create((set) => ({
    data: new DataStore(),
    addSequenceClass: (className, symbolName) => (set((state) => (
        ({ data: state.data.addSequenceClass(new SequenceClass(className, symbolName)) })
    ))),
    removeSequenceClass: (sequenceClass) => (set((state) => (
        ({ data: state.data.removeSequenceClass(sequenceClass) })
    ))),
    updateSequenceClass: (sequenceClass, className, symbolName) => (set((state) => (
        ({ data: state.data.setSequenceClass(sequenceClass, sequenceClass.update(className, symbolName)) })
    ))),
    addSequence: (sequenceClass, newSequence) => (set((state) => (
        ({ data: state.data.setSequenceClass(sequenceClass, sequenceClass.addSequence(newSequence)) })
    ))),
    removeSequence: (sequenceClass, sequence) => (set((state) => (
        ({ data: state.data.setSequenceClass(sequenceClass, sequenceClass.removeSequence(sequence)) })
    ))),
}));
*/

export const useDataStore = create((set) => ({
    sequenceClasses: [],
    negativeSeqClass: {
        name: "Negatives",
        symbolName: "",
        sequences: [],
    },
    addSequenceClass: (className, symbolName) => (set((state) => (
        { sequenceClasses: [...state.sequenceClasses, {
                name: className,
                symbolName: symbolName,
                sequences: [] 
            }]
        }
    ))),
    removeSequenceClass: (sequenceClass) => (set((state) => (
        {}
    ))),
    updateSequenceClass: (sequenceClass, className, symbolName) => (set((state) => (
        {}
    ))),
    addSequence: (sequenceClass, newSequence) => (set((state) => (
        {}
    ))),
    removeSequence: (sequenceClass, sequence) => (set((state) => (
        {}
    ))),
}))