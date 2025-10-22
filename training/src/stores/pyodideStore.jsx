import { create } from 'zustand';
import { useDataStore } from "./dataStore.jsx";
// import { trainingScript } from '../training_script.jsx';

export const usePyodideStore = create((set, get) => ({
    instance: null,
    status: 'idle', // idle, loading, ready, or running
    output: null,

    initialize: () => {
        if (get().status != 'idle') {
            return; // already initialized
        }
        set(() => (
            { status: 'loading' }
        )) 
        const exec = async () => {
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
            set(() => (
                { instance: instance, status: 'ready' }
            ))
        }
        exec()
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
            await pyodide.runPythonAsync("print('Hello World')");
            const result = JSON.parse(pyodide.globals.get("json_result_str"));
            set(() => (
                { status: 'ready', output: result }
            ))
        };
        exec(); // async call
    },
}))