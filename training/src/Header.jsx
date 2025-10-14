import './Header.css';
import SwitchButton from "./components/buttons/SwitchButton";
import DownloadButton from "./components/buttons/DownloadButton";
import { useUiStore } from './stores/uiStore';

function Header() {
    const mode = useUiStore((state) => state.mode);
    const setMode = useUiStore((state) => state.setMode);
    const handleToggle = () => {
        if (mode === 'edit') {
            setMode('train');
        } else {
            setMode('edit');
        }
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
                        <DownloadButton />
                    </div>
                </>
            }
        </div>
    );
}

export default Header;