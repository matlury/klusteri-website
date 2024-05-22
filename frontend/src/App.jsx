import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
import { green } from '@mui/material/colors';



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

  const icons = [<HomeOutlinedIcon/>, <InfoOutlinedIcon/>, <CalendarMonthOutlinedIcon/>, <KeyOutlinedIcon/>,
   <ManageAccountsOutlinedIcon/>, <LocationOnOutlinedIcon/>, <FactCheckOutlinedIcon/>, <AdminPanelSettingsOutlinedIcon/>]
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

            href= {`/${text.toLowerCase().replace(/\s+/g, '_').replace(/ä/g, 'a')
            .replace(/ö/g, 'o')}`}>
              <ListItemIcon>
               {icons[index]} 
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
          bgcolor: '#FFFFFF',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color={'primary'}>
            Ilotalo 3.0
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
              <Route path="/etusivu" element={<FrontPage />} />
              <Route path="/christina_regina" element={<ChristinaRegina />} />
              <Route path="/varaukset" element={<Reservations />} />

              <Route path="/yhteystiedot" element={<Contacts />} />
              <Route path="/saannot_ja_ohjeet"element={<Rules_and_Instructions />}/>
              <Route path="/tietosuojaseloste" element={<PrivacyPolicy />} />
              
    
            </Routes>
          </Router>
      </Box>
    </Box>
  );
}





export default App;