import './Button.css'
import CircleButton from './CircleButton'
import plusIcon from '../../assets/plus_icon.svg';


function PlusButton({ onClick }) {
    return (
        <CircleButton onClick={onClick} backgroundColor={"var(--primary)"}>
            <img src={plusIcon} className="plusIcon" alt="plus icon" />   
        </CircleButton>
    )
}

export default PlusButton;