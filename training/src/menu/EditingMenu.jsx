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
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const setChosenSeqClsName = useUiStore((state) => state.setChosenSeqClassName);
    const { popup, setPopup } = usePopup();

    const onSelect = (seqClsName) => {
        setChosenSeqClsName(seqClsName);
    }

    const onEdit = (seqClsName) => {
        setChosenSeqClsName(seqClsName);
        setPopup(<EditPathClassPopup type='edit' />);
    }

    const onNew = () => {
        setPopup(<EditPathClassPopup type='new' />)
    }

    return (
        <div className="editingMenu">
            <RoundButton
                backgroundColor={chosenSeqClsName === "Negatives" ? 'var(--editmode-primary)' : 'var(--editmode-primary-dark)'}
                onClick={() => onSelect('Negatives')}
            >
                Negatives
            </RoundButton>
            <div className='separator' />
            <ul>
                {seqClasses.filter((item) => item.name !== 'Negatives').map((item) => (
                    <li key={item.name}>
                        <EditableButton
                            backgroundColor={item.name === chosenSeqClsName ? 'var(--editmode-primary)' : 'var(--editmode-primary-dark)'}
                            onEdit={() => onEdit(item.name)}
                            onClick={() => onSelect(item.name)}
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