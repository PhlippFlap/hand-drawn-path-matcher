import './InitialPage.css';
import RoundButton from '../components/buttons/RoundButton';
import FileUploadArea from '../components/FileUploadArea';

function InitialPage({ onProjectInput }) {
    let fileReader;

     const handleFileRead = (e) => {
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