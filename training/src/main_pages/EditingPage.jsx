import './EditingPage.css'
import { useState, useEffect, useCallback } from 'react';
import RoundButton from '../components/buttons/RoundButton';
import BackButton from '../components/buttons/BackButton';
import LeftArrowButton from '../components/buttons/LeftArrowButton';
import RightArrowButton from '../components/buttons/RightArrowButton';
import DrawingCanvas from '../components/DrawingCanvas';
import { useUiStore } from '../stores/uiStore';
import { useDataStore } from '../stores/dataStore'
import ViewingCanvas from '../components/ViewingCanvas';
import CanvasMenu from '../menu/CanvasMenu';

function TutorialPage() {
    return (
        <div className='editPageTutorial'>
            <p>
                Choose a sequence class
            </p>
        </div>
    );
}

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

function AddPage() {
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const removeLastSequence = useDataStore((state) => state.removeLastSequence);
    const addSequence = useDataStore((state) => state.addSequence);
    const [path, setPath] = useState([]);

    const handlePathAdding = (path) => {
        setPath(path);
        addSequence(chosenSeqClsName, path);
    }

    const handleRemoveLatest = () => {
        removeLastSequence(chosenSeqClsName);
        setPath([]);
    }

    return (
        <CanvasMenu
            canvas={
                <DrawingCanvas path={path} handlePath={handlePathAdding} />
            }
            leftButton={null}
            rightButton={null}
            middleButtons={[
                <RoundButton onClick={handleRemoveLatest} backgroundColor={'var(--red)'}>
                    Remove
                </RoundButton>,
                <RoundButton onClick={() => setPath([])} backgroundColor={'var(--primary)'}>
                    Keep
                </RoundButton>
            ]}
        />
    );
}

function BrowsePage({ editMode = false }) {
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const [seqIndex, setSeqIndex] = useState(0);
    const getSequenceCount = useDataStore((state) => state.getSequenceCount);
    const getSequence = useDataStore((state) => state.getSequence);
    const removeSequence = useDataStore((state) => state.removeSequence);
    const [path, setPath] = useState(getSequence(chosenSeqClsName, seqIndex));

    const updatePath = useCallback(() => {
        setPath(getSequence(chosenSeqClsName, seqIndex));
    }, [chosenSeqClsName, seqIndex, getSequence]);

    useEffect(() => {
        updatePath();
    }, [updatePath, seqIndex]);

    const seqAvailable = (seqClsName, index) => {
        return getSequence(seqClsName, index) !== undefined;
    }

    const onDelete = () => {
        removeSequence(chosenSeqClsName, seqIndex);
        if (seqIndex >= getSequenceCount(chosenSeqClsName)) {
            setSeqIndex(getSequenceCount(chosenSeqClsName) - 1);
        }
    }

    return (
        <CanvasMenu
            canvas={(seqAvailable(chosenSeqClsName, seqIndex)) ? 
                <ViewingCanvas path={path} /> 
                : <p>There is nothing here jet</p>
            }
            leftButton={(seqIndex > 0 && seqAvailable(chosenSeqClsName, seqIndex)) &&
                <LeftArrowButton onClick={() => setSeqIndex(seqIndex - 1)} />
            }
            rightButton={seqAvailable(chosenSeqClsName, seqIndex + 1) &&
                <RightArrowButton onClick={() => setSeqIndex(seqIndex + 1)} />
            }
            middleButtons={
                (editMode && seqAvailable(chosenSeqClsName, seqIndex)) ? 
                [
                    <RoundButton onClick={onDelete} backgroundColor={'var(--red)'}>
                        Remove
                    </RoundButton>,
                    <RoundButton
                        onClick={() => (seqIndex + 1 < getSequenceCount(chosenSeqClsName) ? setSeqIndex(seqIndex + 1) : {})}
                        backgroundColor={'var(--primary)'}
                    >
                        Keep
                    </RoundButton>
                ] : []
            }
        />
    );
}

function EditingPageNonEmpty() {
    // possible states: menu, browse, edit, add
    const mode = useUiStore((state) => state.editingPageMode);
    const setMode = useUiStore((state) => state.setEditingPageMode);

    return (
        <>
            {mode === 'menu' &&
                <Menu setMode={setMode} />
            }
            {mode !== 'menu' &&
                <>
                    <BackButton onCLick={() => setMode('menu')} />
                    {mode === 'browse' &&
                        <BrowsePage />
                    }
                    {mode === 'edit' &&
                        <BrowsePage editMode={true} />
                    }
                    {mode === 'add' &&
                        <AddPage />
                    }
                </>
            }
        </>
    );
}

function EditingPage() {
    const classChosen = useUiStore((state) => state.chosenSeqClassName != null);
    return (
        <>
            {!classChosen &&
                <TutorialPage />
            }
            {classChosen &&
                <EditingPageNonEmpty />
            }
        </>
    );
}

export default EditingPage;