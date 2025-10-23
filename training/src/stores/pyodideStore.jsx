import { create } from 'zustand';
import { useDataStore } from "./dataStore.jsx";
import trainingScriptFile from '../scripts/training.txt';

export const usePyodideStore = create((set, get) => ({
    instance: null,
    status: 'idle', // idle, loading, ready, or running
    output: null,
    trainingScript: "",

    initialize: () => {
        if (get().status != 'idle') {
            return; // already initialized
        }
        set(() => (
            { status: 'loading' }
        )) 
        const exec = async () => {
            // Read training script as string
            const trainingScript = await fetch(trainingScriptFile).then(res => res.text());
            // ChatGPT solved this. Now the URL to the pyodide script is directly attached into the HTML script element.
            // There was an issue with bundlers trying to resolve @pyodide/pyodide from node_modules.
            // Dynamically load the official Pyodide CDN loader to avoid bundler resolution issues
            // This keeps the package out of node_modules and matches the indexURL used below.
            if (!window.loadPyodide) {
                await new Promise((resolve, reject) => {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js';
                    s.onload = resolve;
                    s.onerror = () => reject(new Error('Failed to load pyodide CDN script'));
                    document.head.appendChild(s);
                });
            }
            const instance = await window.loadPyodide({indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/'});
            // import packages with micropip
            await instance.loadPackage("micropip");
            const micropip = instance.pyimport("micropip");
            await micropip.install("numpy");
            set(() => (
                { instance: instance, status: 'ready', trainingScript: trainingScript }
            ))
        }
        exec()
    },
    executeTrainingScript: (onFinish) => {
        if (get().instance == null) {
            return; // instance (deliberately) not loaded
        }
        if (get().status !== 'ready') {
            throw new Error('Pyodide instance not ready');
        }
        set(() => (
            { status: 'running' }
        ))
        const exec = async () => {
            const pyodide = get().instance;
            const data = useDataStore.getState();
            const jsonInputString = JSON.stringify(data, null, 2);
            pyodide.globals.set("json_input_str", jsonInputString);
            await pyodide.runPythonAsync(get().trainingScript);
            const resultString = pyodide.globals.get("json_output_str");
            if (resultString == undefined) {
                console.error("Value of 'json_output_str' is undefined after running script with pyodide!")
            }
            const result = JSON.parse(resultString);
            set(() => (
                { status: 'ready', output: result }
            ))
            onFinish();
        };
        exec(); // async call
    },
    getOutputJSON: () => {
        return get().output;
    },
}))