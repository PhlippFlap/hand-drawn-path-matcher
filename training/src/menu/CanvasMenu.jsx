import './CanvasMenu.css';

function CanvasMenu({
    canvas, // the canvas element
    leftButton, // the go left button
    rightButton, // the go right button
    middleButtons // list of elements
}) {
    return (
        <div className='canvasMenu'>
            <div className='canvasContainer'>
                {canvas}
            </div>
            <div className='canvasButtons'>
                <div className='canvasNaviButtonContainer'>
                    {leftButton}
                </div>
                {middleButtons?.map((item) => (
                    <div className='canvasButtonContainer'>
                        {item}
                    </div>
                ))}
                <div className='canvasNaviButtonContainer'>
                    {rightButton}
                </div>
            </div>
        </div>
    );
}

export default CanvasMenu;