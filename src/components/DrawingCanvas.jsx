import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import PixelConverter from './PixelConverter';

function DrawingCanvas({ 
    path, handlePath, onStartDrawing=() => {}
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

    const normX = (x) => {
        return Math.round((x / dimensions.width * 2 - 1) * 1000) / 1000;
    }
    const normY = (y) => {
        return Math.round((y / dimensions.height * 2 - 1) * 1000) / 1000;
    }

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        // convert pixel coordinates to normalized coordinates between -1 and 1
        setLocalPath([normX(pos.x), normY(pos.y)]);
        onStartDrawing();
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        // add point
        // convert pixel coordinates to normalized coordinates between -1 and 1
        setLocalPath(localPath.concat(normX(point.x), normY(point.y)));
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
                        // This could be a reason for visual delay when drawing
                        points={localPath.map((point, i) => i % 2 === 0 ? 
                            (point + 1) / 2 * dimensions.width :
                            (point + 1) / 2 * dimensions.height
                        )}
                        stroke="white"
                        strokeWidth={1}
                    />
                </Layer>
            </Stage>
        </PixelConverter>
    );
};

export default DrawingCanvas;
