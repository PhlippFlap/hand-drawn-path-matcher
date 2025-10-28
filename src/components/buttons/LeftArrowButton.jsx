import './Button.css'
import CircleButton from './CircleButton'
import arrowIcon from '../../assets/arrow_icon.svg';


function LeftArrowButton({ onClick }) {
    return (
        <CircleButton onClick={onClick} backgroundColor={"var(--primary)"}>
            <img src={arrowIcon} className="leftArrowIcon" alt="arrow icon" />   
        </CircleButton>
    )
}

export default LeftArrowButton;