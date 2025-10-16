import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import PixelConverter from './PixelConverter';

function DrawingCanvas({ 
    path, handlePath
    //  A path is a sequence of point coordinates like x1, y1, x2, y2, ...
}) {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    })

    const [localPath, setLocalPath] = useState(path);
    useEffect(() => {
        setLocalPath(path);
    }, [path]);

    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLocalPath([pos.x, pos.y]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        // add point
        setLocalPath(localPath.concat([point.x, point.y]));
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        handlePath(localPath);
    };

    return (
        <PixelConverter setDimensions={setDimensions}>
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
                        points={localPath}
                        stroke="white"
                        strokeWidth={1}
                        //tension={0.5}
                        // lineCap="round"
                        // lineJoin="round"
                    />
                </Layer>
            </Stage>
        </PixelConverter>
    );
};

export default DrawingCanvas;
