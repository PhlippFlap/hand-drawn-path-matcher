import { useState } from 'react'
import './App.css'
import DownloadButton from './components/buttons/DownloadButton';
import PlusButton from './components/buttons/PlusButton';
import LeftArrowButton from './components/buttons/LeftArrowButton';
import RightArrowButton from './components/buttons/RightArrowButton';
import Header from './Header';
import EditableButton from './components/buttons/EditableButton';
import RoundButton from './components/buttons/RoundButton';
import InitialPage from './main_pages/initial/InitialPage';
import PopupProvider, { usePopup } from './components/PopupProvider';
import EditPathClassPopup from './popups/EditPathClassPopup';
import { useUiStore } from './stores/ui_store';

function download() {
}

function Content() {
    const mode = useUiStore((state) => state.mode);
    const [project, setProject] = useState(null);
    const { popup, setPopup } = usePopup();

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
            {popup && 
                popup
            }
            <Header/>
            {mode==='init' && 
                <InitialPage onProjectInput={onProjectInput} />
            }
            <DownloadButton onClick={handleDownload} />
            <PlusButton onClick={() => setPopup(<EditPathClassPopup/>)} />
            <LeftArrowButton />
            <RightArrowButton />
            <EditableButton onClick={() => alert('click')} onEdit={() => alert('edit')} backgroundColor={'var(--primary)'}>
                test
            </EditableButton>
            <RoundButton onClick={() => alert('click')} backgroundColor='green'>
                Test
            </RoundButton>
        </>
    );
}

function App() {
    return (
        <PopupProvider>
            <Content />
        </PopupProvider>
    )
}

export default App
