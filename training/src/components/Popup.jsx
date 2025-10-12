import "./Popup.css"

function Popup({ children }) {
    return (
        <div className='popupContainer'>
            {children}
        </div>
    )
}

export default Popup;