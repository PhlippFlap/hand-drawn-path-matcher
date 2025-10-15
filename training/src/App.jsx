import { useState } from 'react'
import './App.css'
import Header from './Header';
import InitialPage from './main_pages/InitialPage';
import PopupProvider, { usePopup } from './components/PopupProvider';
import { useUiStore } from './stores/uiStore';
import EditingMenu from './menu/EditingMenu';
import EditingPage from './main_pages/EditingPage';
import { useDataStore } from './stores/dataStore';

function download() {
}

function LeftMenu({ children }) {
    return (
        <div className='leftMenu'>
            {children}
        </div>
    );
}

function MainWindow({ children }) {
    return (
        <div className='mainWindow'>
            {children}
        </div>
    );
}

function Content() {
    const mode = useUiStore((state) => state.mode);
    const setMode = useUiStore((state) => state.setMode);
    const loadData = useDataStore((state) => state.load);
    const { popup, setPopup } = usePopup();

    const onProjectInput = (project) => {
        loadData(project);
        setMode('edit');
    }

    return (
        <>
            {popup &&
                popup
            }
            <Header />
            {mode === 'init' &&
                <InitialPage onProjectInput={onProjectInput} />
            }
            {mode === 'edit' &&
                <>
                    <LeftMenu>
                        <EditingMenu />
                    </LeftMenu>
                    <MainWindow>
                        <EditingPage />
                    </MainWindow>
                </>
            }
        </>
    );
}

function App() {
    return (
        <PopupProvider>
            <Content />
        </PopupProvider>
    )
}

export default App
