import './TrainingPage.css'
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
import { usePyodideStore } from '../stores/pyodideStore';

function TrainAllButton() {
    const executeTrainingScript = usePyodideStore((state) => state.executeTrainingScript);
    const getOutputJSON = usePyodideStore((state) => state.getOutputJSON)

    const onTrain = () => {
        const onFinish = () => {
            alert('Training Finished')
            alert(JSON.stringify(getOutputJSON(), null, 2))
        }
        executeTrainingScript(onFinish)
    }

    return (
        <RoundButton
            onClick={() => onTrain()}
            backgroundColor={'var(--trainmode-primary-dark)'}
        >
            Train All
        </RoundButton>
    );
}

function TutorialPage() {
    return (
        <div className='trainingPageTutorial'>
            <div style={{ width: '10rem' }}>
                <TrainAllButton />
            </div>
        </div>
    );
}

function BrowseFalsePositivesPage() {
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const [seqIndex, setSeqIndex] = useState(0);
    const getSequence = useDataStore((state) => state.getFalsePositiveSequence);
    const [path, setPath] = useState(getSequence(chosenSeqClsName, seqIndex));

    const updatePath = useCallback(() => {
        setPath(getSequence(chosenSeqClsName, seqIndex));
    }, [chosenSeqClsName, seqIndex, getSequence]);

    useEffect(() => {
        updatePath();
    }, [updatePath]);

    const seqAvailable = (seqClsName, index) => {
        return getSequence(seqClsName, index) !== undefined;
    }

    return (
        <CanvasMenu
            canvas={(seqAvailable(chosenSeqClsName, seqIndex)) ?
                <ViewingCanvas path={path} />
                : <p>There is nothing here</p>
            }
            leftButton={(seqIndex > 0 && seqAvailable(chosenSeqClsName, seqIndex)) &&
                <LeftArrowButton onClick={() => setSeqIndex(seqIndex - 1)} />
            }
            rightButton={seqAvailable(chosenSeqClsName, seqIndex + 1) &&
                <RightArrowButton onClick={() => setSeqIndex(seqIndex + 1)} />
            }
            middleButtons={null}
        />
    );
}

function FineTunePage() {
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const [path, setPath] = useState([]);
    const [evaluation, setEvaluation] = useState("");

    const handlePathAdding = (path) => {
        setPath(path);
        // todo evaluate sequence
    }

    const onDiscard = () => {
        setPath([]);
        setEvaluation("");
    }

    return (
        <div className='finetune'>
            <div className='finetuneCanvasContainer'>
                <DrawingCanvas path={path} handlePath={handlePathAdding} onStartDrawing={() => setEvaluation("")} />
            </div>
            <div className='finetuneMenu'>
                <p>
                    {'Evaluated class: ' + evaluation}
                </p>
                <RoundButton
                    onClick={() => onDiscard()}
                    backgroundColor={'var(--trainmode-primary-dark)'}
                >
                    Discard
                </RoundButton>
                <RoundButton
                    onClick={() => alert('Add as negative')}
                    backgroundColor={'var(--trainmode-primary-dark)'}
                >
                    Add as Negative
                </RoundButton>
                <RoundButton
                    onClick={() => alert('Add as positive')}
                    backgroundColor={'var(--trainmode-primary-dark)'}
                >
                    Add as Positive
                </RoundButton>
                <div className='trainingPageSeparator' />
                <TrainAllButton />
            </div>
        </div>
    );
}

function Menu({ setMode }) {
    const negativesChosen = useUiStore((state) => state.chosenSeqClassName === 'Negatives')

    return (
        <div className='trainingPageMenu'>
            {!negativesChosen &&
                <>
                    <RoundButton
                        onClick={() => setMode('browseFalsePositives')}
                        backgroundColor={'var(--trainmode-primary-dark)'}
                    >
                        Browse false positives
                    </RoundButton>
                    <RoundButton
                        onClick={() => setMode('fineTune')}
                        backgroundColor={'var(--trainmode-primary-dark)'}
                    >
                        Finetune
                    </RoundButton>
                </>
            }
            <TrainAllButton />
        </div>
    );
}

function TrainingPageNonEmpty() {
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
                    {mode === 'fineTune' &&
                        <FineTunePage />
                    }
                    {mode === 'browseFalsePositives' &&
                        <BrowseFalsePositivesPage />
                    }
                </>
            }
        </>
    );
}

function TrainingPage() {
    const classChosen = useUiStore((state) => state.chosenSeqClassName != null);
    const hasBeenTrained = useDataStore((state) => state.hasBeenTrained);

    return (
        <>
            {(!classChosen || !hasBeenTrained(classChosen)) &&
                <TutorialPage />
            }
            {(classChosen && hasBeenTrained(classChosen)) &&
                <TrainingPageNonEmpty />
            }
        </>
    );
}

export default TrainingPage;