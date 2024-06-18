import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';  
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem, Menu } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import matlu from "./matlu.png";

import FrontPage from "./pages/frontpage";
import LoginPage from "./pages/loginpage";
import ChristinaRegina from "./pages/christina_regina";
import OwnPage from "./pages/ownpage";
import PrivacyPolicy from "./pages/privacypolicy";
import Contacts from "./pages/contacts";
import DefectFault from "./pages/defectfaultpage";
import Rules_and_Instructions from "./pages/rules_instructions";
import CleaningSchedule from "./pages/cleaningschedulepage";
import Reservations from "./pages/reservations";
import OwnKeys from "./pages/ownkeys";
import Statistics from "./pages/statistics";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useTranslation } from "react-i18next";
import i18n from "./i18n";

const drawerWidth = 240;

const LoginDialog = ({ open, onClose, onLogin, onCreateNewUser }) => {
  const { t } = useTranslation();
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      PaperProps={{ style: { minWidth: '400px' } }} // Set minimum width
    >
      <DialogTitle>{t("loginsuggest")}</DialogTitle>
      <DialogContent>
        <LoginPage onLogin={onLogin} onCreateNewUser={onCreateNewUser} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

const Sidebar = ({ isLoggedIn }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const icons = [
    <HomeOutlinedIcon />,
    <InfoOutlinedIcon />,
    <CalendarMonthOutlinedIcon />,
    <BedtimeOutlinedIcon />,
    <ManageAccountsOutlinedIcon />,
    <BarChartIcon />,
    <LocationOnOutlinedIcon />,
    <BuildOutlinedIcon />,
    <CleaningServicesIcon />,
    <FactCheckOutlinedIcon />,
    <AdminPanelSettingsOutlinedIcon />,
  ];

  const routes = [
    { key: "front_sidebar_1", path: "/etusivu", icon: icons[0] },
    { key: "front_sidebar_2", path: "/christina_regina", icon: icons[1] },
    { key: "front_sidebar_3", path: "/varaukset", icon: icons[2] },
    { key: "front_sidebar_4", path: "/ykv", icon: icons[3], requiresLogin: true },
    { key: "front_sidebar_5", path: "/omat_tiedot", icon: icons[4], requiresLogin: true },
    { key: "front_sidebar_6", path: "/tilastot", icon: icons[5], requiresLogin: true },
    { key: "front_sidebar_7", path: "/yhteystiedot", icon: icons[6] },
    { key: "front_sidebar_8", path: "/viat", icon: icons[7], requiresLogin: true },
    { key: "front_sidebar_9", path: "/siivousvuorot", icon: icons[8], requiresLogin: true },
    { key: "front_sidebar_10", path: "/saannot_ja_ohjeet", icon: icons[9] },
    { key: "front_sidebar_11", path: "/tietosuojaseloste", icon: icons[10] },
  ];

  return (
    <div>
      <Box sx={{ padding: "16px", width: "100%" }}>
        <a href="/">
          <img src={matlu} alt="logo" style={{ height: "auto", width: "100%" }} />
        </a>
      </Box>
      <Divider />
      <List>
        {routes.map(({ key, path, requiresLogin }, index) => {
          if (requiresLogin && !isLoggedIn) return null;
          return (
            <ListItem key={key} disablePadding>
              <ListItemButton
                key={key}
                component={Link}
                to={path}
                sx={{
                  backgroundColor: location.pathname === path ? '#9e9e9e' : 'transparent',
                  '&:hover': {
                    backgroundColor: location.pathname === path ? '#9e9e9e' : '#e0e0e0',
                  },
                }}
              >
                <ListItemIcon>{icons[index]}</ListItemIcon>
                <ListItemText primary={t(key)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </div>
  );
};


const App = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const [showLoginPage, setShowLoginPage] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loggedUser, setLoggedUser] = React.useState(
    JSON.parse(localStorage.getItem("loggedUser")) || null,
  );

  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);

  const [language, setLanguage] = React.useState(
    localStorage.getItem("lang") || "fi"
  )

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [anchorElLang, setAnchorElLang] = React.useState(null)

  React.useEffect(() => {
    i18n.changeLanguage(localStorage.getItem("lang") || "fi")
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

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
    setLoginDialogOpen(false); // Close the dialog upon successful login
  };

  // Removes localstorage value if someone logs out
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("isLoggedIn");
    setLoggedUser(null);
    setIsLoggedIn(false);
  };

  const openLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const handleLangChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    setAnchorElLang(null); // Close the menu after selecting an option
  };

  const { t } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleIconClick = (event) => {
    setAnchorElLang(event.currentTarget); // Set anchorEl to the clicked element
  };

  const handleClose = () => {
    setAnchorElLang(null); // Close the menu
  };

  const open = Boolean(anchorElLang);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "#484644",
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }, color: "white" }}  // Change color to white
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color={"white"}>
          Ilotalo 3.0
            </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="primary" onClick={handleIconClick}>
              <TranslateIcon
              color="primary" sx={{ color: 'white' }} />
            </IconButton>
            <Menu
              anchorEl={anchorElLang}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem onClick={() => handleLangChange('fi')}>Suomi</MenuItem>
              <MenuItem onClick={() => handleLangChange('en')}>English</MenuItem>
            </Menu>
            {isLoggedIn ? (
              <>
                <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
                  onClick={handleMenuClick}
                  sx={{ marginLeft: 'auto' }}
                  endIcon={<ArrowDropDownIcon />}
              style={{ color: "white" }}
                >
              {loggedUser ? loggedUser.username : "User"}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" onClick={openLoginDialog}>
                {t("login")}
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "#E9E9E9",  // Set background color here for temporary drawer
              },
            }}
          >
            <Sidebar isLoggedIn={isLoggedIn} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "#E9E9E9",  // Set background color here for permanent drawer
              },
            }}
            open
          >
            <Sidebar isLoggedIn={isLoggedIn} />
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/etusivu" element={<FrontPage />} />
            <Route path="/christina_regina" element={<ChristinaRegina />} />
            <Route path="/varaukset" element={<Reservations />} />
            <Route
              path="/ykv"
              element={
                <OwnKeys isLoggedIn={isLoggedIn} loggedUser={loggedUser} />
              }
            />
            <Route
              path="/omat_tiedot"
              element={<OwnPage isLoggedIn={isLoggedIn} />}
            />
            <Route path="/tilastot" element={<Statistics />}/>
            <Route path="/yhteystiedot" element={<Contacts />} />
            <Route
              path="/viat"
              element={<DefectFault isLoggedIn={isLoggedIn} loggedUser={loggedUser} />}
            />
            <Route path="/siivousvuorot" element={<CleaningSchedule isLoggedIn={isLoggedIn} loggedUser={loggedUser} />}
            />
            <Route
              path="/saannot_ja_ohjeet"
              element={<Rules_and_Instructions />}
            />
            <Route path="/tietosuojaseloste" element={<PrivacyPolicy />} />
          </Routes>
          <LoginDialog
            open={loginDialogOpen}
            onClose={closeLoginDialog}
            onLogin={handleLogin}
            onCreateNewUser={handleCreateNewUser}
          />
        </Box>
      </Box>
    </Router>
  );
};

export default App;
