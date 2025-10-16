import './EditPathClassPopup.css';
import RoundButton from "../components/buttons/RoundButton";
import Popup from '../components/Popup';
import { useUiStore } from '../stores/uiStore';
import { useDataStore } from '../stores/dataStore';
import { useRef, useState } from 'react';

function EditPathClassPopup({
    type // either 'new' or 'edit'
}) {
    const setPopup = useUiStore((state) => state.setPopup);
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const getSymbolName = useDataStore((state) => state.getSymbolName);
    const setChosenSeqClsName = useUiStore((state) => state.setChosenSeqClassName);
    const addSequenceClass = useDataStore((state) => state.addSequenceClass);
    const removeSequenceClass = useDataStore((state) => state.removeSequenceClass);
    const updateSequenceClass = useDataStore((state) => state.updateSequenceClass);
    const [ errMessage, setErrMessage ] = useState("");

    const symbolNameRef = useRef(null);
    const classNameRef = useRef(null);

    const handleDelete = () => {
        removeSequenceClass(chosenSeqClsName);
        setPopup(null);
    }

    const handleSave = () => {
        const name = classNameRef.current.value;
        const symbolName = symbolNameRef.current.value;
        if (type === 'new') {
            const { success, err } = addSequenceClass(name, symbolName, []);
            if (success) {
                setChosenSeqClsName(name);
                setPopup(null);
            } else {
                setErrMessage(err);
            }
        } else {
            const { success, err } = updateSequenceClass(chosenSeqClsName, name, symbolName);
            if (success) {
                setChosenSeqClsName(name);
                setPopup(null);
            } else {
                setErrMessage(err);
            }
        }
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
                            defaultValue={type === 'edit' ? getSymbolName(chosenSeqClsName) : ''}
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
                            defaultValue={type === 'edit' ? chosenSeqClsName : ''}
                        />
                    </div>
                    <p>
                        This is the name of the class path.
                        A class path is sensitive to the direction the symbol is drawn.
                        There can be multiple class paths per symbol.
                    </p>
                </div>
                <span style={{color: 'red', height: '1.5rem'}}>
                    {errMessage}
                </span>
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