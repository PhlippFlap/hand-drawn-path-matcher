import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';

function DrawingCanvas({ 
    handlePath, // Function that expects the finished path as parameter.
    //  A path is a sequence of point coordinates like x1, y1, x2, y2, ...
    initialPath = [],
    // canDraw // true if the user is allowed to draw a new path
}) {
    const divRef = useRef(null)
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    })

    // We cant set the h & w on Stage to 100% it only takes px values so we have to
    // find the parent container's w and h and then manually set those !
    const computeSize = () => {
        if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
            setDimensions({
                width: divRef.current.offsetWidth,
                height: divRef.current.offsetHeight
            })
        }
    }

    useEffect(() => {
        computeSize();
        window.addEventListener('resize', computeSize);
    
        return () => {
            window.removeEventListener('resize', computeSize);
        };
    }, [])

    const [path, setPath] = useState(initialPath);
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setPath([pos.x, pos.y]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        // add point
        setPath(path.concat([point.x, point.y]));
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        handlePath(path);
    };

    return (
        <div ref={divRef} style={{width: '100%', height: '100%'}}>
            <Stage
                width={dimensions.width} 
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <Layer>
                    <Line
                        points={path}
                        stroke="white"
                        strokeWidth={1}
                        //tension={0.5}
                        // lineCap="round"
                        // lineJoin="round"
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default DrawingCanvas;
