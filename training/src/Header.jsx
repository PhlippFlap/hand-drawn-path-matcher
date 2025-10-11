import './Header.css';
import SwitchButton from "./components/buttons/SwitchButton";
import DownloadButton from "./components/buttons/DownloadButton";

function Header({mode, setMode}) {
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
                Hand Drawn Path Matcher
            </div>
            {mode !== 'init' &&
                <div className="switchBtnContainer">
                    <SwitchButton onToggle={handleToggle}/>
                </div>
            }
            <div className="downloadBtnContainer">
                <DownloadButton />
            </div>
        </div>
    );
}

export default Header;