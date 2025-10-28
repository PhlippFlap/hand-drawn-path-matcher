import "./Spread.css"

function Spread({ children, leftPadding='1rem', rightPadding='1rem' }) {
    return (
        <div className='spread' style={{paddingLeft:leftPadding, paddingRight: rightPadding}}>
            {children}
        </div>
    )
}

export default Spread;