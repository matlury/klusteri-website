import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import matlu from './matlu.png';
import FrontPage from './pages/frontpage';
import LoginPage from './pages/loginpage';
import NewAccountPage from './pages/createpage';
import ChristinaRegina from './pages/christina_regina';
import OwnPage from './pages/ownpage';

const App = () => {
  const [showLoginPage, setShowLoginPage] = useState(true)
  const [user, setUser] = useState(null)

  const handleCreateNewUser = () => {
    setShowLoginPage(false);
  };

  const handleBackToLogin = () => {
    setShowLoginPage(true);
  };

  const OpenFrontPage = () => {
    const frontpage_url = '/'
    window.open(frontpage_url, '_self')
  }
  const OpenChristinaRegina = () => {
    const christinaregina_url = '/christinaregina'
    window.open(christinaregina_url, '_self')
  }
  const OpenReservations = () => {
    const reservations_url = '/varaukset'
    window.open(reservations_url, '_self')
  }
  const OpenKeys = () => {
    const keys_url = '/omat_avaimet'
    window.open(keys_url, '_self')
  }
  const OpenInformation = () => {
    const information_url = '/omat_tiedot'
    window.open(information_url, '_self')
  }
  const OpenContacts = () => {
    const contacts_url = '/yhteystiedot'
    window.open(contacts_url, '_self')
  }
  const OpenRulesAndInstructions = () => {
    const rules_and_instructions_url = '/saannot_ja_ohjeet'
    window.open(rules_and_instructions_url, '_self')
  }

  const OpenPrivacyPolicy = () => {
    const privacypolicy_url = 'https://matlu.fi/static/3f7acf0e44035d9fee529336282a10e7/0cb49548aae9482eede839a1970fdb7b.pdf'
    window.open(privacypolicy_url, '_self')
  }

  return (
    <Router>
      <div>
        <div id='blackscreen'>
          <img src={matlu} id="leftLogo" width="200" height="150" alt="Logo" />
        </div>
        <div id='nav'>
          <span className="link" onClick={OpenFrontPage}>Etusivu</span>
          <span className="link" onClick={OpenChristinaRegina}>Christina Regina</span>
          <span className="link" onClick={OpenReservations}>Varaukset</span>
          <span className="link" onClick={OpenKeys}>Omat avaimet</span>
          <span className="link" onClick={OpenInformation}>Omat tiedot</span>
          <span className="link" onClick={OpenContacts}>Yhteystiedot</span>
          <span className="link" onClick={OpenRulesAndInstructions}>Säännöt ja ohjeet</span>
          <span className="link" onClick={OpenPrivacyPolicy}>Tietosuojaseloste</span>
        </div>
        <div id='ContentBlock' className='flex-container'>
          <div className='left_content'>
            <Routes>
              <Route path="/christinaregina" element={<ChristinaRegina />} />
              <Route path="/" element={<FrontPage />} />
              <Route path="/omat_tiedot" user={user} element={<OwnPage />} />
            </Routes>
          </div>
          <div className='right_content'>
            {showLoginPage ? (
              <LoginPage onCreateNewUser={handleCreateNewUser} />
            ) : (
              <NewAccountPage onAccountCreated={handleCreateNewUser} />
            )}
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
