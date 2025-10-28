import "./EditableButton.css"
import editIcon from '../../assets/edit_icon.svg';

function EditableButton({ 
    onClick,
    onEdit,
    backgroundColor,
    color='white',
    children
}) {
    return (
        <div className="editableButton">
            <button onClick={onClick} style={{backgroundColor, color}} className={'mainPart'}>
                {children}
            </button>
            <button onClick={onEdit} style={{backgroundColor, color}} className={'editPart'}>
                <img src={editIcon} className="editIcon" alt="edit icon" />   
            </button>
        </div>
    )
}

export default EditableButton;