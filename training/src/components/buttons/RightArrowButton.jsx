import './Button.css'
import CircleButton from './CircleButton'
import arrowIcon from '../../assets/arrow_icon.svg';


function RightArrowButton({ onClick }) {
    return (
        <CircleButton onClick={onClick} backgroundColor={"var(--primary)"}>
            <img src={arrowIcon} className='rightArrowIcon' alt="arrow icon" />   
        </CircleButton>
    )
}

export default RightArrowButton;