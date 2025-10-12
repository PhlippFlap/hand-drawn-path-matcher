import './EditPathClassPopup.css';
import RoundButton from "../components/buttons/RoundButton";
import Popup from '../components/Popup';
import { usePopup } from '../components/PopupProvider';

function EditPathClassPopup() {
    const { popup, setPopup } = usePopup();

    return (
        <Popup>
            <div className='popup'>
                <label>
                    Symbol name:
                    <input name="symbolNameInput" />
                </label>
                <label>
                    Path class name:
                    <input name="pathClassNameInput" />
                </label>
                <div className='bottomButtons'>
                    <RoundButton onClick={() => setPopup(null)} backgroundColor={'var(--gray)'}>
                        Cancel
                    </RoundButton>
                    <RoundButton onClick={() => alert('click')} backgroundColor={'var(--gray)'}>
                        Save
                    </RoundButton>
                </div>
            </div>
        </Popup>
    );
}

export default EditPathClassPopup;