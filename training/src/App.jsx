import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import DownloadIcon from './assets/download_icon.svg?react';
import editIcon from './assets/edit_icon.svg';
import downloadIcon from './assets/download_icon.svg';
import arrowIcon from './assets/arrow_icon.svg';
import plusIcon from './assets/plus_icon.svg';
import DownloadButton from './components/buttons/DownloadButton';
import PlusButton from './components/buttons/PlusButton';
import LeftArrowButton from './components/buttons/LeftArrowButton';
import RightArrowButton from './components/buttons/RightArrowButton';
import SwitchButton from './components/buttons/SwitchButton';
import Header from './Header';

function download() {
}

function App() {
    const [mode, setMode] = useState('init');

    const handleDownload = () => {
        setMode('download');
    }

    return (
        <>
            <Header mode={mode} setMode={setMode}/>
            {mode==='init' && 
                <div>
                    <img src={editIcon} style={{ height: "2rem" }} alt="edit icon" />
                    <img src={downloadIcon} style={{ height: "2rem" }} alt="download icon" />
                    <img src={plusIcon} style={{ height: "2rem" }} alt="plus icon" />
                    <img src={arrowIcon} style={{ height: '2rem' }} alt="arrow icon" />
                </div>
            }
            <DownloadButton onClick={handleDownload} />
            <PlusButton />
            <LeftArrowButton />
            <RightArrowButton />
        </>
    )
}

export default App
