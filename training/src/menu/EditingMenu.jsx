import './EditingMenu.css'
import { useDataStore } from "../stores/dataStore";
import { useUiStore } from '../stores/uiStore';
import { useShallow } from 'zustand/react/shallow'
import EditableButton from '../components/buttons/EditableButton';
import EditPathClassPopup from '../popups/EditPathClassPopup';
import PlusButton from '../components/buttons/PlusButton';
import RoundButton from '../components/buttons/RoundButton';
import Spread from '../components/Spread';

function EditingMenu() {
    // I'm not sure if useShallow works in this scenario
    const seqClasses = useDataStore(useShallow((state) => state.sequenceClasses));
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const setChosenSeqClsName = useUiStore((state) => state.setChosenSeqClassName);
    const setPopup = useUiStore((state) => state.setPopup);

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
                <Spread>
                    <span>Negatives</span>
                    <span>
                        {'[' + seqClasses.find((item) => item.name === 'Negatives').sequences.length + ']'}
                    </span>
                </Spread>
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
                            <Spread rightPadding='0.3rem'>
                                <span>
                                    <span>{item.name}</span>
                                    <span style={{ color: 'var(--gray-light)' }}>
                                        {" | " + item.symbolName}
                                    </span>
                                </span>
                                <span>
                                    {'[' + item.sequences.length + ']'}
                                </span>
                            </Spread>
                        </EditableButton>
                    </li>
                ))}
            </ul>
            <PlusButton onClick={onNew} />
        </div>
    );
}

export default EditingMenu;