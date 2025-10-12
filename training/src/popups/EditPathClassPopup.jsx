import './EditPathClassPopup.css';
import RoundButton from "../components/buttons/RoundButton";
import Popup from '../components/Popup';
import { usePopup } from '../components/PopupProvider';

function EditPathClassPopup() {
    const { popup, setPopup } = usePopup();

    return (
        <Popup>
            <div className='popup'>
                <div className='fieldContainer'>
                    <div className='field'>
                        <label htmlFor="symbolName">
                        Symbol Name:
                        </label>
                        <input id="symbolName" type="text" name="symbolNameInput" placeholder="my_fancy_rune"/>
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
                        <input id="pathName" type="text" name="pathClassNameInput" placeholder="my_fancy_rune_left_to_right"/>
                    </div>
                    <p>
                        This is the name of the class path. 
                        A class path is sensitive to the direction the symbol is drawn.
                        There can be multiple class paths per symbol.
                    </p>
                </div>
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