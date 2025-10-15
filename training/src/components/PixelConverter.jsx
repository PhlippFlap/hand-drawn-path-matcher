import { useRef, useEffect } from "react"

function PixelConverter({ setDimensions, children }) {
    const divRef = useRef(null)

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

    return (
        <div ref={divRef} style={{width: '100%', height: '100%'}}>
            {children}
        </div>
    );
}

export default PixelConverter;