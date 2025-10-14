import "./BackButton.css"
import arrowIcon from '../../assets/arrow_icon.svg';

function BackButton({
    onCLick
}) {
    return (
        <button onClick={onCLick} className='backButton'>
            <img src={arrowIcon} className="backArrowIcon" alt="back icon" />
            <span>back</span>
        </button>
    )
}

export default BackButton;