import "./RoundButton.css"

function RoundButton({ 
    onClick, 
    backgroundColor, 
    color='white', 
    children 
}) {
    return (
        <button onClick={onClick} style={{ backgroundColor, color }} className="roundButton">
            {children}
        </button>
    )
}

export default RoundButton;