import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import BarChartIcon from '@mui/icons-material/BarChart';
import FormatColorResetOutlinedIcon from '@mui/icons-material/FormatColorResetOutlined';
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
import { FormControl, Select, MenuItem } from "@mui/material";
import matlu from "./matlu.png";

import FrontPage from "./pages/frontpage";
import LoginPage from "./pages/loginpage";
import ChristinaRegina from "./pages/christina_regina";
import OwnPage from "./pages/ownpage";
import PrivacyPolicy from "./pages/privacypolicy";
import Contacts from "./pages/contacts";
import DefectFault from "./pages/defectfaultpage";
import Rules_and_Instructions from "./pages/rules_instructions";
import Reservations from "./pages/reservations";
import OwnKeys from "./pages/ownkeys";
import Statistics from "./pages/statistics";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import i18n from "./i18n";

const drawerWidth = 240;

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
    localStorage.removeItem("isLoggedIn");
  };

  const openLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const handleLangChange = (event) => {
    event.preventDefault();
    setLanguage(event.target.value)
    i18n.changeLanguage(event.target.value)
    localStorage.setItem("lang", event.target.value)
  }

  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const icons = [
    <HomeOutlinedIcon />,
    <InfoOutlinedIcon />,
    <CalendarMonthOutlinedIcon />,
    <KeyOutlinedIcon />,
    <ManageAccountsOutlinedIcon />,
    <BarChartIcon />,
    <LocationOnOutlinedIcon />,
    <FormatColorResetOutlinedIcon/>,
    <FactCheckOutlinedIcon />,
    <AdminPanelSettingsOutlinedIcon />,
  ];

  const listItems = [
    { key: "front_sidebar_1", path: "etusivu", icon: icons[0] },
    { key: "front_sidebar_2", path: "christina_regina", icon: icons[1] },
    { key: "front_sidebar_3", path: "varaukset", icon: icons[2]},
    { key: "front_sidebar_4", path: "omat_avaimet", icon: icons[3]},
    { key: "front_sidebar_5", path: "omat_tiedot", icon: icons[4]},
    { key: "front_sidebar_6", path: "tilastot", icon: icons[5]},
    { key: "front_sidebar_7", path: "yhteystiedot", icon: icons[6]},
    { key: "front_sidebar_8", path: "viat", icon: icons[7]},
    { key: "front_sidebar_9", path: "saannot_ja_ohjeet", icon: icons[8]},
    { key: "front_sidebar_10", path: "tietosuojaseloste", icon: icons[9]}
  ];

  const drawer = (
    <div>
      <img src={matlu} alt="logo" style={{ height: "auto" }} />{" "}
      {/* ADD PADDING TO LOGO */}
      <Divider />
      <List>
      {listItems.map(({ key, path, icon }) => (
        <ListItem key={t(key)} disablePadding>
          <ListItemButton
            component={Link}
            to={`/${`${path}`}`}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={t(key)} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
      <Divider />
      <FormControl variant="standard"
        style={{ padding: '10px' }} fullWidth>
          <Select
            value={language}
            label="Kieli"
            onChange={handleLangChange}
          >
          <MenuItem value={"fi"}>Suomi</MenuItem>
          <MenuItem value={"en"}>English</MenuItem>
          </Select>
      </FormControl>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const LoginDialog = ({ open, onClose, onLogin, onCreateNewUser }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t("login")}</DialogTitle>
        <DialogContent>
          <LoginPage onLogin={onLogin} onCreateNewUser={onCreateNewUser} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("cancel")}</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "#FFFFFF",
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
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color={"primary"}>
              Ilotalo 3.0
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {isLoggedIn ? (
              <Button
                variant="outlined"
                className="logout-button"
                onClick={handleLogout}
              >
                {t("logout")}{" "}
              </Button>
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
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
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
              path="/omat_avaimet"
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
