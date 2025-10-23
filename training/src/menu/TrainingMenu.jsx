import './TrainingMenu.css'
import { useDataStore } from "../stores/dataStore";
import { useUiStore } from '../stores/uiStore';
import { useShallow } from 'zustand/react/shallow'
import RoundButton from '../components/buttons/RoundButton';

function TrainingMenu() {
    // I'm not sure if useShallow works in this scenario
    const seqClasses = useDataStore(useShallow((state) => state.sequenceClasses));
    const chosenSeqClsName = useUiStore((state) => state.chosenSeqClassName);
    const setChosenSeqClsName = useUiStore((state) => state.setChosenSeqClassName);

    const onSelect = (seqClsName) => {
        setChosenSeqClsName(seqClsName);
    }

    return (
        <div className="trainingMenu">
            <RoundButton
                backgroundColor={chosenSeqClsName === "Negatives" ? 'var(--trainmode-primary)' : 'var(--trainmode-primary-dark)'}
                onClick={() => onSelect('Negatives')}
            >
                Negatives
            </RoundButton>
            <div className='trainingMenuSeparator' />
            <ul>
                {seqClasses.filter((item) => item.name !== 'Negatives').map((item) => (
                    <li key={item.name}>
                        <RoundButton
                            backgroundColor={item.name === chosenSeqClsName ? 'var(--trainmode-primary)' : 'var(--trainmode-primary-dark)'}
                            onClick={() => onSelect(item.name)}
                        >
                            <div className='trainingMenuButtonContent'>
                                <span className='trainingMenuSeqClassName'>
                                    {item.name}
                                </span>
                                <span className='trainingMenuSymbolName'>
                                    {" | " + item.symbolName}
                                </span>
                            </div>
                        </RoundButton>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrainingMenu;