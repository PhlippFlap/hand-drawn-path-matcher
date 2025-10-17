import './InitialPage.css';
import RoundButton from '../components/buttons/RoundButton';
import FileUploadArea from '../components/FileUploadArea';
import * as defaultProject from '../default_project.json';

function InitialPage({ onProjectInput }) {
    let fileReader;

    const handleFileRead = () => {
        const content = fileReader.result;
        const project = JSON.parse(content);
        onProjectInput(project);
    };

    const onFileUpload = (file) => {
        if (file != null) {
            try {
                fileReader = new FileReader();
                fileReader.onloadend = handleFileRead;
                fileReader.readAsText(file);
                //file.then((f) => f.text())
                //.then((textContent) => {
                //    alert(textContent);
                //});
                //const cleanedFile = file.replace("\n", "");
                //const project = JSON.parse(cleanedFile);
                //onProjectInput(project);
            }
            catch (err) {
                alert('Failed to read JSON file: ' + err.message);
            }
        }
    };

    const onLoadDefault = () => {
        onProjectInput(defaultProject);
    }

    const onCreateNew = () => {
        const emptyProject = {
            sequenceClasses: [
                {
                    name: "Negatives",
                    symbolName: "",
                    sequences: []
                }
            ]
        }
        onProjectInput(emptyProject);
    }

    return (
        <div className="initPage">
            <div className="fileUploadContainer">
                <FileUploadArea onFileUpload={onFileUpload} />
            </div>
            <p>or</p>
            <div className="initPageButtonContainer">
                <RoundButton onClick={onCreateNew} backgroundColor='var(--primary)'>
                    Create new empty project
                </RoundButton>
            </div>
            <div className="initPageButtonContainer">
                <RoundButton onClick={onLoadDefault} backgroundColor='var(--primary)'>
                    Load default project
                </RoundButton>
            </div>
        </div>
    );
}

export default InitialPage;