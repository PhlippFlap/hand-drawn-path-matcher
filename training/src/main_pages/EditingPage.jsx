import './EditingPage.css'
import { useState } from 'react';
import RoundButton from '../components/buttons/RoundButton';
import BackButton from '../components/buttons/BackButton';
import LeftArrowButton from '../components/buttons/LeftArrowButton';
import RightArrowButton from '../components/buttons/RightArrowButton';

function Menu({ setMode }) {
    return (
        <div className='editPageMenu'>
            <RoundButton
                onClick={() => setMode('browse')}
                backgroundColor={'var(--editmode-primary-dark)'}
            >
                Browse
            </RoundButton>
            <RoundButton
                onClick={() => setMode('edit')}
                backgroundColor={'var(--editmode-primary-dark)'}
            >
                Edit
            </RoundButton>
            <RoundButton
                onClick={() => setMode('add')}
                backgroundColor={'var(--editmode-primary-dark)'}
            >
                Add new
            </RoundButton>
        </div>
    );
}

function EditingPage() {
    // possible states: menu, browse, edit, add
    const [mode, setMode] = useState('menu');

    return (
        <>
            {mode==='menu' &&
                <Menu setMode={setMode}/> 
            }
            {mode!=='menu' &&
                <>
                    <BackButton onCLick={() => setMode('menu')} />
                    <div className='canvasView'>
                        <div className='canvasContainer'>

                        </div>
                        <div className='canvasButtons'>
                            <LeftArrowButton onClick={() => {}}/>
                            {(mode==='edit' || mode=='add') &&
                                <>
                                <div className='canvasButtonContainer'>
                                <RoundButton backgroundColor={'var(--primary)'}>
                                    test
                                </RoundButton>
                                </div>
                                <div className='canvasButtonContainer'>
                                    <RoundButton backgroundColor={'var(--primary)'}>
                                        test
                                    </RoundButton>
                                </div>
                                </>
                            }
                            <RightArrowButton onClick={() => {}}/>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default EditingPage;