import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import matlu from './matlu.png';

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

import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";



const drawerWidth = 240;


// Next constants are used for UI eg. toggle the navigation menu.
const App = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };



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

  const drawer = (
    <div>
      <img src={matlu} alt="logo" style={{height: '15%'}} />
      <Divider />
      <List>
        {['Etusivu', 'Christina Regina', 'Varaukset', 'Omat avaimet', 'Omat tiedot', 'Yhteystiedot', 'Säännöt ja ohjeet', 'Tietosuojaseloste'].map((text, index) => (
           <ListItem key={text} disablePadding>
            {/*</ListItemButton>{/* <ListItemButton component={Link} to={text === 'Etusivu' ? '/' : `/${text.toLowerCase().replace(/\s+/g, '_')}`}> */}
            
            <ListItemButton 
            key={text} 
            component="a"
            href= {`/${text.toLowerCase().replace(/\s+/g, '_')}`}

            >
           
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>

              <ListItemText primary={text} />

            </ListItemButton>
           
          </ListItem>
        ))}

      </List>
      <Divider />
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Ilotalo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
          <Router>
            <Routes>
              
              <Route path="/" element={<FrontPage />} />
              <Route path="/christinaregina" element={<ChristinaRegina />} />
            </Routes>
          </Router>
      </Box>
    </Box>
  );
}





export default App;