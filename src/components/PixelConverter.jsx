import { useRef, useEffect } from "react"

function PixelConverter({ setDimensions, children }) {
    const divRef = useRef(null)

    // listen to resize
    useEffect(() => {
        const computeSize = () => {
            if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
                setDimensions({
                    width: divRef.current.offsetWidth,
                    height: divRef.current.offsetHeight
                })
            }
        }

        computeSize();
        window.addEventListener('resize', computeSize);

        return () => {
            window.removeEventListener('resize', computeSize);
        };
    }, [setDimensions])

    return (
        <div ref={divRef} style={{ width: '100%', height: '100%' }}>
            {children}
        </div>
    );
}

export default PixelConverter;