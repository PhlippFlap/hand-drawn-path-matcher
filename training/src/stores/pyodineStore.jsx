import { loadPyodide } from "@pyodide/pyodide";
import { create } from 'zustand';
import { useDataStore } from "./dataStore";
import { trainingScript } from '../training_script.jsx';

export const usePyodineStore = create((set, get) => ({
    instance: null,
    status: 'idle', // idle, loading, ready, or running
    output: null,

    initialize: async () => {
        set(() => (
            { status: 'loading' }
        )) 
        const instance = await loadPyodide();
        // Read local python file as string
        set(() => (
            { instance: instance, scriptStr: scriptText, status: 'ready' }
        ))
    },
    executeTrainingScript: () => {
        if (get().status !== 'ready') {
            throw new Error('Pyodide instance not ready');
        }
        set(() => (
            { status: 'running' }
        ))
        const exec = async () => {
            const pyodide = get().instance;
            const data = useDataStore.getState();
            const jsonInputString = JSON.stringify(data);
            pyodide.globals.set("json_input_str", jsonInputString);
            await pyodide.runPythonAsync(trainingScript);
            const result = JSON.parse(pyodide.globals.get("json_result_str"));
            set(() => (
                { status: 'ready', output: result }
            ))
        };
        exec(); // async call
    },
}))