import './Header.css';
import SwitchButton from "./components/buttons/SwitchButton";
import DownloadButton from "./components/buttons/DownloadButton";
import { useUiStore } from './stores/uiStore';
import { useDataStore } from './stores/dataStore';
import { saveAs } from 'file-saver';

function Header() {
    const mode = useUiStore((state) => state.mode);
    const setMode = useUiStore((state) => state.setMode);
    const data = useDataStore((state) => state);

    const handleToggle = () => {
        if (mode === 'edit') {
            setMode('train');
        } else {
            setMode('edit');
        }
    }

    const onDownload = () => {
        const json = JSON.stringify(data, null, 2);
        const file = new File([json], "project.json", { type: 'application/json' })
        saveAs(file);
    }

    return (
        <div className="header">
            <div className="title">
                <p>Hand Drawn Path Matcher</p>
            </div>
            {mode !== 'init' &&
                <>
                    <div className="switchBtnContainer">
                        <SwitchButton onToggle={handleToggle}/>
                    </div>
                    <div className="downloadBtnContainer">
                        
                        <DownloadButton onClick={onDownload}/>
                    </div>
                </>
            }
        </div>
    );
}

export default Header;