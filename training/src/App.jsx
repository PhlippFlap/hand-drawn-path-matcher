import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import DownloadIcon from './assets/download_icon.svg?react';
import editIcon from './assets/edit_icon.svg';
import downloadIcon from './assets/download_icon.svg';
import arrowIcon from './assets/arrow_icon.svg';
import plusIcon from './assets/plus_icon.svg';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={editIcon} style={{height:"2rem"}} alt="edit icon" />
        <img src={downloadIcon} style={{height:"2rem"}} className="logo" alt="download icon" />
        <img src={plusIcon} style={{height:"2rem"}} className="logo" alt="plus icon" />
        <img src={arrowIcon} style={{height:'2rem'}} alt="arrow icon" />
      </div>
    </>
  )
}

export default App
