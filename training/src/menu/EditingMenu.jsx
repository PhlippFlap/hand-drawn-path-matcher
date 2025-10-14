import './EditingMenu.css'
import { useDataStore } from "../stores/dataStore";
import { useUiStore } from '../stores/uiStore';
import { useShallow } from 'zustand/react/shallow'
import EditableButton from '../components/buttons/EditableButton';
import { usePopup } from '../components/PopupProvider';
import EditPathClassPopup from '../popups/EditPathClassPopup';
import PlusButton from '../components/buttons/PlusButton';
import RoundButton from '../components/buttons/RoundButton';

function EditingMenu() {
    // I'm not sure if useShallow works in this scenario
    const seqClasses = useDataStore(useShallow((state) => state.sequenceClasses));
    const negSeqClass = useDataStore((state) => state.negativeSeqClass);
    const chosenClass = useUiStore((state) => state.chosenSequenceClass);
    const setChosenClass = useUiStore((state) => state.setChosenSeqClass);
    const { popup, setPopup } = usePopup();

    const onSelect = (seqClass) => {
        setChosenClass(seqClass);
    }

    const onEdit = (seqClass) => {
        setChosenClass(seqClass);
        setPopup(<EditPathClassPopup type='edit' />);
    }

    const onNew = (seqClass) => {
        setPopup(<EditPathClassPopup type='new' />)
    }

    return (
        <div className="menu">
            <RoundButton
                backgroundColor={(chosenClass && chosenClass.name === negSeqClass.name) ? 'var(--editmode-primary)' : 'var(--editmode-primary-dark)'}
                onClick={() => onSelect(negSeqClass)}
            >
                {negSeqClass.name}
            </RoundButton>
            <div className='separator' />
            <ul>
                {seqClasses.map((item) => (
                    <li key={item.name}>
                        <EditableButton
                            backgroundColor={(chosenClass && item.name === chosenClass.name) ? 'var(--editmode-primary)' : 'var(--editmode-primary-dark)'}
                            onEdit={() => onEdit(item)}
                            onClick={() => onSelect(item)}
                        >
                            <div className='buttonContent'>
                                <span className='seqClassName'>
                                    {item.name}
                                </span>
                                <span className='symbolName'>
                                    {" | " + item.symbolName}
                                </span>
                            </div>
                        </EditableButton>
                    </li>
                ))}
            </ul>
            <PlusButton onClick={onNew} />
        </div>
    );
}

export default EditingMenu;