import "./SwitchButton.css"
import { useState } from "react";

function SwitchButton({ 
    onToggle, 
}) {
    const [state, setState] = useState('left'); 
    const handleToggle = () => {
        if (state === 'left') {
            setState('right');
        } else {
            setState('left');
        }
        onToggle(state);
    }
    return (
        <div className="switchButton">
            <button onClick={handleToggle} className={`${'left'} ${state==='left' ? 'leftActive' : 'inactive'}`}>
                Editing Mode
            </button>
            <button onClick={handleToggle} className={`${'right'} ${state==='right' ? 'rightActive' : 'inactive'}`}>
                Training Mode
            </button>
        </div>
    )
}

export default SwitchButton;