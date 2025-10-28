import './TrainingMenu.css'
import { useDataStore } from "../stores/dataStore";
import { useUiStore } from '../stores/uiStore';
import { useShallow } from 'zustand/react/shallow'
import RoundButton from '../components/buttons/RoundButton';
import Spread from '../components/Spread';

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
                <Spread>
                    <span>Negatives</span>
                    <span>
                        {'[' + seqClasses.find((item) => item.name === 'Negatives').sequences.length + ']'}
                    </span>
                </Spread>
            </RoundButton>
            <div className='trainingMenuSeparator' />
            <ul>
                {seqClasses.filter((item) => item.name !== 'Negatives').map((item) => (
                    <li key={item.name}>
                        <RoundButton
                            backgroundColor={item.name === chosenSeqClsName ? 'var(--trainmode-primary)' : 'var(--trainmode-primary-dark)'}
                            onClick={() => onSelect(item.name)}
                        >
                            <Spread>
                                <span>{item.name}</span>
                                <span>{'[' + item.sequences.length + ']'}</span>
                            </Spread>
                        </RoundButton>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrainingMenu;