import "./SwitchButton.css"
import { useState } from "react";

function SwitchButton({ 
    onToggle, initialState='left'
}) {
    const [state, setState] = useState(initialState); 
    const handleToggle = () => {
        if (state === 'left') {
            setState('right');
            onToggle('right');
        } else {
            setState('left');
            onToggle('left');
        }
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