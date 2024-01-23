import './index.css'
import matlu from './matlu.png'
import FrontPage from './pages/frontpage'
import React from 'react'

const App = () => {

  return(
  <div>
    <div id= 'blackscreen'>
      <img src= {matlu} id="leftLogo" width="200" height="150"></img>
    </div>

    <FrontPage />
  </div>
)}

export default App
