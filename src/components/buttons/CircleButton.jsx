import "./Button.css"

function CircleButton({ onClick, backgroundColor, children }) {
    return (
        <button onClick={onClick} style={{ backgroundColor }} className="circleButton">
            {children}
        </button>
    )
}

export default CircleButton;