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
                        points={path.map((point, i) => i % 2 === 0 ? 
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

export default ViewingCanvas;
