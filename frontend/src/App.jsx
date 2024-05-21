import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";
import matlu from "./matlu.png";
import FrontPage from "./pages/frontpage";
import LoginPage from "./pages/loginpage";
import NewAccountPage from "./pages/createpage";
import ChristinaRegina from "./pages/christina_regina";
import OwnPage from "./pages/ownpage";
import PrivacyPolicy from "./pages/privacypolicy";
import Contacts from "./pages/contacts";
import Rules_and_Instructions from "./pages/rules_instructions";
import Reservations from "./pages/reservations";
import OwnKeys from "./pages/ownkeys";

import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const App = () => {
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser")) || null,
  );

  // Checks whether a user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Hides login page and shows create new user page
  const handleCreateNewUser = () => {
    setShowLoginPage(false);
  };

  // Sets localstorage value to true, if someone is logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Removes localstorage value if someone logs out
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  // The next constants are paths to different pages on the website. They are accessible by clicking their names in the navigation bar

  const OpenFrontPage = () => {
    const frontpage_url = "/";
    window.open(frontpage_url, "_self");
  };
  const OpenChristinaRegina = () => {
    const christinaregina_url = "/christinaregina";
    window.open(christinaregina_url, "_self");
  };
  const OpenReservations = () => {
    const reservations_url = "/varaukset";
    window.open(reservations_url, "_self");
  };
  const OpenKeys = () => {
    const keys_url = "/omat_avaimet";
    window.open(keys_url, "_self");
  };
  const OpenInformation = () => {
    const information_url = "/omat_tiedot";
    window.open(information_url, "_self");
  };
  const OpenContacts = () => {
    const contacts_url = "/yhteystiedot";
    window.open(contacts_url, "_self");
  };
  const OpenRulesAndInstructions = () => {
    const rules_and_instructions_url = "/saannot_ja_ohjeet";
    window.open(rules_and_instructions_url, "_self");
  };

  const OpenPrivacyPolicy = () => {
    const privacypolicy_url = "/tietosuojaseloste";
    window.open(privacypolicy_url, "_self");
  };

  // Routes to the different pages. Everything is displayed on the left side of the screen, except the login info and register info is on the right side
  return (
    <Router>
      <div>
        

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Ilotalo
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Etusivu
            </Button>
            <Button color="inherit" component={Link} to="/christinaregina">
              Christina Regina
            </Button>
            <Button color="inherit" component={Link} to="/varaukset">
              Varaukset
            </Button>
            <Button color="inherit" component={Link} to="/omat_avaimet">
              Omat avaimet
            </Button>
            <Button color="inherit" component={Link} to="/omat_tiedot">
              Omat tiedot
            </Button>
            <Button color="inherit" component={Link} to="/yhteystiedot">
              Yhteystiedot
            </Button>
            <Button color="inherit" component={Link} to="/saannot_ja_ohjeet">
              Säännöt ja ohjeet
            </Button>
            <Button color="inherit" component={Link} to="/tietosuojaseloste">
              Tietosuojaseloste
            </Button>


          </Toolbar>
        </AppBar>

        <div id="ContentBlock" className="flex-container">
          <div className="left_content">
            <Routes>
              <Route path="/christinaregina" element={<ChristinaRegina />} />
              <Route path="/" element={<FrontPage />} />
              <Route
                path="/omat_tiedot"
                element={<OwnPage isLoggedIn={isLoggedIn} />}
              />
              <Route path="/tietosuojaseloste" element={<PrivacyPolicy />} />
              <Route path="/yhteystiedot" element={<Contacts />} />
              <Route
                path="/saannot_ja_ohjeet"
                element={<Rules_and_Instructions />}
              />
              <Route path="/varaukset" element={<Reservations />} />
              <Route
                path="/omat_avaimet"
                element={
                  <OwnKeys isLoggedIn={isLoggedIn} loggedUser={loggedUser} />
                }
              />
            </Routes>
          </div>
          <div className="right_content">
            {showLoginPage ? (
              <LoginPage
                onLogin={handleLogin}
                onLogout={handleLogout}
                onCreateNewUser={handleCreateNewUser}
              />
            ) : (
              <NewAccountPage onAccountCreated={handleCreateNewUser} />
            )}
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
