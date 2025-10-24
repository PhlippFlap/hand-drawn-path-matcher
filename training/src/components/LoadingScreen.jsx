import "./LoadingScreen.css"

function LoadingScreen({ hidden=false }) {
    return (
        <>
            {!hidden &&
                <div className='loadingScreen'>
                    Working ...
                </div>
            }
            {hidden && 
                <div className='loadingScreenHidden' />
            }
        </>
    )
}

export default LoadingScreen;