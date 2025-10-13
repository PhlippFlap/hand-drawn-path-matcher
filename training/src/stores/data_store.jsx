import { create } from 'zustand';

export class SequenceClass {
    name;
    symbolName;
    sequences;

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
    sequenceClasses;
    negativeSeqClass;

    constructor (sequenceClasses = []) {
        this.sequenceClasses = sequenceClasses;
        this.negativeSeqClass = new SequenceClass("Negatives", "");
    }

    existsName (sequenceClassName) {
        return sequenceClassName !== "Negatives" || this.sequenceClasses.find(c => c.name === sequenceClassName) !== undefined;
    }

    copy () {
        return new DataStore([...this.sequenceClasses]);
    }

    addSequenceClass(sequenceClass) {
        if (!existsName(sequenceClass.name)) {
            const copy = this.copy();
            copy.sequenceClasses.push(sequenceClass);
            return copy;
        }
        return this.copy();
    }

    removeSequenceClass(sequenceClass) {
        return this.copy().filter(c => c !== sequenceClass);
    }

    setSequenceClass(oldClass, newClass) {
        return this.copy().map(c => (c === oldClass ? newClass : c));
    }
}

export const useDataStore = create((set) => ({
    data: new DataStore(),
    addSequenceClass: (className, symbolName) => (set((state) => (
        state.data.addSequenceClass(new SequenceClass(className, symbolName))
    ))),
    removeSequenceClass: (sequenceClass) => (set((state) => (
        state.data.removeSequenceClass(sequenceClass)
    ))),
    updateSequenceClass: (sequenceClass, className, symbolName) => (set((state) => (
        state.data.setSequenceClass(sequenceClass, sequenceClass.update(className, symbolName))
    ))),
    addSequence: (sequenceClass, newSequence) => (set((state) => (
        state.data.setSequenceClass(sequenceClass, sequenceClass.addSequence(newSequence))
    ))),
    removeSequence: (sequenceClass, sequence) => (set((state) => (
        state.data.setSequenceClass(sequenceClass, sequenceClass.removeSequence(sequence))
    ))),
}));