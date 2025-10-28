import './Button.css'
import CircleButton from './CircleButton'
import downloadIcon from '../../assets/download_icon.svg';


function DownloadButton({ onClick }) {
    return (
        <CircleButton onClick={onClick} backgroundColor={"var(--primary)"}>
            <img src={downloadIcon} className="downloadIcon" alt="download icon" />
        </CircleButton>
    )
}

export default DownloadButton;