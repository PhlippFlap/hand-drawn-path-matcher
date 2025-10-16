import { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import PixelConverter from './PixelConverter';

function ViewingCanvas({ 
    path,
}) {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    })

    return (
        <PixelConverter setDimensions={setDimensions}>
            <Stage
                width={dimensions.width} 
                height={dimensions.height}
            >
                <Layer>
                    <Line
                        points={path}
                        stroke="white"
                        strokeWidth={1}
                    />
                </Layer>
            </Stage>
        </PixelConverter>
    );
};

export default ViewingCanvas;
