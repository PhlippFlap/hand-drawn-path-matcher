import './EditPathClassPopup.css';
import RoundButton from "../components/buttons/RoundButton";
import Popup from '../components/Popup';
import { usePopup } from '../components/PopupProvider';
import { useUiStore } from '../stores/uiStore';
import { useDataStore } from '../stores/dataStore';
import { useRef } from 'react';

function EditPathClassPopup({
    type // either 'new' or 'edit'
}) {
    const { popup, setPopup } = usePopup();
    const chosenSeqClass = useUiStore((state) => state.chosenSequenceClass);
    const addSequenceClass = useDataStore((state) => state.addSequenceClass);
    const removeSequenceClass = useDataStore((state) => state.removeSequenceClass);
    const updateSequenceClass = useDataStore((state) => state.updateSequenceClass);

    const symbolNameRef = useRef(null);
    const classNameRef = useRef(null);

    const handleDelete = () => {
        removeSequenceClass(chosenSeqClass);
        setPopup(null);
    }

    const handleSave = () => {
        if (type === 'new') {
            addSequenceClass(classNameRef.current.value, symbolNameRef.current.value);
        } else {
            updateSequenceClass(chosenSeqClass, classNameRef.current.value, symbolNameRef.current.value);
        }
        setPopup(null);
    }

    return (
        <Popup>
            <div className='popup'>
                <div className='fieldContainer'>
                    <div className='field'>
                        <label htmlFor="symbolName">
                            Symbol Name:
                        </label>
                        <input id="symbolName" ref={symbolNameRef} type="text" name="symbolNameInput"
                            placeholder={type === 'new' ? 'e.g. My-Symbol' : ''}
                            defaultValue={type === 'edit' ? chosenSeqClass.symbolName : ''}
                        />
                    </div>
                    <p>
                        This is the name of the symbol the path class represents.
                        The name has to be unique.
                    </p>
                </div>
                <div className='fieldContainer'>
                    <div className='field'>
                        <label htmlFor="pathName">
                            Path Class Name:
                        </label>
                        <input id="pathName" ref={classNameRef} type="text" name="pathClassNameInput"
                            placeholder={type === 'new' ? 'e.g. My-Name' : ''}
                            defaultValue={type === 'edit' ? chosenSeqClass.name : ''}
                        />
                    </div>
                    <p>
                        This is the name of the class path.
                        A class path is sensitive to the direction the symbol is drawn.
                        There can be multiple class paths per symbol.
                    </p>
                </div>
                {type === 'edit' &&
                    <div className='deleteContainer'>
                        <RoundButton
                            onClick={() => handleDelete()}
                            backgroundColor='var(--red)'
                        >
                            Delete
                        </RoundButton>
                    </div>
                }
                <div className='bottomButtons'>
                    <RoundButton
                        onClick={() => setPopup(null)}
                        backgroundColor='var(--gray)'
                    >
                        Cancel
                    </RoundButton>
                    <RoundButton
                        onClick={() => handleSave()}
                        backgroundColor='var(--gray)'
                    >
                        Save
                    </RoundButton>
                </div>
            </div>
        </Popup>
    );
}

export default EditPathClassPopup;