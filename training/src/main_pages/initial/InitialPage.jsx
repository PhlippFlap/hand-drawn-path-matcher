import './InitialPage.css';
import RoundButton from '../../components/buttons/RoundButton';
import FileUploadArea from '../../components/FileUploadArea';
import { useState } from 'react';

function InitialPage({ onProjectInput }) {
    const onFileUpload = (file) => {
        if (file != null) {
            try {
                const project = JSON.parse(file);
                onProjectInput(project);
            }
            catch (err) {
                alert('Failed to read JSON file: ' + err.message);
            }
        }
    };

    const onCreateNew = () => {
        const emptyProject = {};
        onProjectInput(emptyProject);
    }

    return (
        <div className="initPage">
            <div className="fileUploadContainer">
                <FileUploadArea onFileUpload={onFileUpload} />
            </div>
            <p>or</p>
            <div className="createNewContainer">
                <RoundButton onClick={onCreateNew} backgroundColor='var(--primary)'>
                    Create New
                </RoundButton>
            </div>
        </div>
    );
}

export default InitialPage;