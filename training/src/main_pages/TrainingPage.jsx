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
    const getOutput = usePyodideStore((state) => state.getOutput);
    const setTrainedData = useDataStore((state) => state.setTrainedData);
    const setMetaData = useDataStore((state) => state.setMetaData);

    const onTrain = () => {
        const onFinish = () => {
            console.log("Training finished. Output JSON:")
            console.log(JSON.stringify(getOutput(), null, 2));
            const output = getOutput();
            setMetaData(output.targetPointCount, output.maxWeakLearnerCount);
            for (const cls of output.sequenceClasses) {
                if (cls.weakLearners != undefined) {
                    console.log("class " + cls.name + " training result: " + cls.weakLearners.length + " weak learners, " + cls.falsePositives.length + " false posisitives.")
                    setTrainedData(cls.name, cls.weakLearners, cls.falsePositives);
                }
            }
        }
        executeTrainingScript(onFinish);
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
            <div style={{ width: 'var(--main-page-menu-width)' }}>
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
    const executeEvaluationScript = usePyodideStore((state) => state.executeEvaluationScript);
    const addSequence = useDataStore((state) => state.addSequence);
    const [path, setPath] = useState([]);
    const [evaluation, setEvaluation] = useState("");
    const [evaluated, setEvaluated] = useState(false);
    const highlightColor = evaluation === '' ? 'gray' : (evaluation === chosenSeqClsName ? 'green' : 'red')

    const handlePathAdding = (path) => {
        const onFinish = (result) => {
            const evalResult = result.evaluationResult;
            console.log("Evaluation finished. Result: " + evalResult);
            setEvaluation(evalResult);
            setEvaluated(true);
        }
        executeEvaluationScript(path, onFinish);
        setPath(path);
    }

    const onDiscard = () => {
        setPath([]);
        setEvaluation("");
        setEvaluated(false);
    }

    const onStartDrawing = () => {
        setEvaluation("");
        setEvaluated(false);
    }

    const onAddAsPositive = () => {
        if (path.length >= 4) { // at least 2 points
            console.log("Added path as positive example (to class " + chosenSeqClsName + ")");
            addSequence(chosenSeqClsName, path);
            onDiscard(); // clear canvas
        }
    }

    const onAddAsNegative = () => {
        if (path.length >= 4) { // at least 2 points
            console.log("Added path as negative example (to class Negatives)");
            addSequence("Negatives", path);
            onDiscard(); // clear canvas
        }
    }

    return (
        <div className='finetune'>
            <div style={evaluated ? { filter: 'drop-shadow(0 0 7px ' + highlightColor + ')' } : {}} className='finetuneCanvasContainer'>
                <DrawingCanvas path={path} handlePath={handlePathAdding} onStartDrawing={() => onStartDrawing()} />
            </div>
            <div className='finetuneMenu'>
                <p>
                    <span style={{ color: 'gray' }}>
                        {"Path classified as: "}
                    </span>
                    {(evaluated && evaluation === '') &&
                        <span style={{ color: 'gray' }}>
                            -
                        </span>
                    }
                    {(evaluated && evaluation !== '') &&
                        <span>
                            {evaluation}
                        </span>
                    }
                </p>
                <RoundButton
                    onClick={() => onDiscard()}
                    backgroundColor={'var(--trainmode-primary-dark)'}
                >
                    Discard
                </RoundButton>
                <RoundButton
                    onClick={() => onAddAsNegative()}
                    backgroundColor={'var(--trainmode-primary-dark)'}
                >
                    Add as Negative
                </RoundButton>
                <RoundButton
                    onClick={() => onAddAsPositive()}
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
    const chosenClassName = useUiStore((state) => state.chosenSeqClassName);
    const getFalsePositiveCount = useDataStore((state) => state.getFalsePositiveCount);

    return (
        <div className='trainingPageMenu'>
            {chosenClassName !== 'Negatives' &&
                <>
                    <RoundButton
                        onClick={() => setMode('browseFalsePositives')}
                        backgroundColor={'var(--trainmode-primary-dark)'}
                    >
                        Browse false positives {'[' + getFalsePositiveCount(chosenClassName) + ']'}
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
    const chosenClassName = useUiStore((state) => state.chosenSeqClassName);
    const hasBeenTrained = useDataStore((state) => state.hasBeenTrained);

    return (
        <>
            {(chosenClassName == undefined || !hasBeenTrained(chosenClassName)) &&
                <TutorialPage />
            }
            {(chosenClassName != undefined && hasBeenTrained(chosenClassName)) &&
                <TrainingPageNonEmpty />
            }
        </>
    );
}

export default TrainingPage;