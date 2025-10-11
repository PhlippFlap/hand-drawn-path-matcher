import { useState } from 'react'
import './App.css'
import editIcon from './assets/edit_icon.svg';
import downloadIcon from './assets/download_icon.svg';
import arrowIcon from './assets/arrow_icon.svg';
import plusIcon from './assets/plus_icon.svg';
import DownloadButton from './components/buttons/DownloadButton';
import PlusButton from './components/buttons/PlusButton';
import LeftArrowButton from './components/buttons/LeftArrowButton';
import RightArrowButton from './components/buttons/RightArrowButton';
import Header from './Header';
import EditableButton from './components/buttons/EditableButton';
import RoundButton from './components/buttons/RoundButton';
import InitialPage from './main_pages/initial/InitialPage';

function download() {
}

function App() {
    const [mode, setMode] = useState('init');
    const [project, setProject] = useState(null);

    const onProjectInput = (project) => {
        setProject(project);
        alert('Project loaded');
        setMode('edit');
    }

    const handleDownload = () => {
        setMode('download');
    }

    return (
        <>
            <Header mode={mode} setMode={setMode}/>
            {mode==='init' && 
                <InitialPage onProjectInput={onProjectInput} />
            }
            <DownloadButton onClick={handleDownload} />
            <PlusButton />
            <LeftArrowButton />
            <RightArrowButton />
            <EditableButton onClick={() => alert('click')} onEdit={() => alert('edit')} backgroundColor={'var(--primary)'}>
                test
            </EditableButton>
            <RoundButton onClick={() => alert('click')} backgroundColor='green'>
                Test
            </RoundButton>
        </>
    )
}

export default App
