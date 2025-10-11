import './FileUploadArea.css';
import { useRef, useEffect, useState } from 'react';

// Accepts 1 JSON file
function FileUploadArea({ onFileUpload }) {

    // when a file is dropped this is called twice for some reason, keep in mind
    const onFileInput = (file) => {
        if (file != null) {
            onFileUpload(file);
        }
    };

    const dropContainerRef = useRef(null);

    useEffect(() => {
        if (dropContainerRef.current) {
            dropContainerRef.current.addEventListener("dragover", (e) => {
                // prevent default to allow drop
                e.preventDefault();
            }, false);
            dropContainerRef.current.addEventListener("dragenter", () => {
                dropContainerRef.current.classList.add("drag-active");
            })
            dropContainerRef.current.addEventListener("dragleave", () => {
                dropContainerRef.current.classList.remove("drag-active");
            })
            dropContainerRef.current.addEventListener("drop", (e) => {
                e.preventDefault();
                dropContainerRef.current.classList.remove("drag-active");
                // Seems to be not required:
                onFileInput(e.dataTransfer.files[0]);
            })
        }
    }, []);

    return (
        <label htmlFor="fileUpload" className="drop-container" ref={dropContainerRef}>
            <span className="drop-title">Drop files here or click here to choose files</span>
            <input
                type="file"
                id="fileUpload"
                onChange={(event) => onFileInput(event.target.files[0])}
                max={1}
                accept='.json'
            />
        </label>
    );
}

export default FileUploadArea;