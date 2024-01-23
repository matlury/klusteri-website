import './index.css'
import matlu from './matlu.png'
import FrontPage from './pages/frontpage'
import LoginPage from './pages/loginpage'
import React from 'react'

const App = () => {

  return(
  <div>
    <div id= 'blackscreen'>
      <img src= {matlu} id="leftLogo" width="200" height="150"></img>
    </div>
    <div className="flex-container">
        <FrontPage />
        <LoginPage />
      </div>
  </div>
)}

export default App
