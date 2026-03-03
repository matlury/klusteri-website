import * as React from "react";
import { useStateContext } from "@context/ContextProvider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
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
import TranslateIcon from "@mui/icons-material/Translate";
import matlu from "/matlu.png";

import FrontPage from "./pages/frontpage";
import LoginPage from "./pages/loginpage";
import ChristinaRegina from "./pages/christina_regina";
import OwnPage from "./pages/ownpage";
import PrivacyPolicy from "./pages/privacypolicy";
import Contacts from "./pages/contacts";
import DefectFault from "./pages/defectfaultpage";
import Rules_and_Instructions from "./pages/rules_instructions";
import CleaningSchedule from "./pages/cleaningschedulepage";
import CleaningSupplies from "./pages/cleaningsuppliespage";
import Reservations from "./pages/reservations";
import OwnKeys from "./pages/ownkeys";
import Statistics from "./pages/statistics";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tooltip from "@mui/material/Tooltip";

import { useTranslation } from "react-i18next";
import i18n from "./i18n";

// Custom theme with accessible greenish colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#558b2f", // Darker, accessible green (passes 4.5:1 on white)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dcedc8", // Very light green for backgrounds
    },
    background: {
      default: "#fafbf8",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000", // Full black for best contrast
      secondary: "#424242", // Dark grey for secondary text
    },
  },
  typography: {
    h1: { fontWeight: 800, color: "#000000" },
    h2: { fontWeight: 800, color: "#000000" },
    h3: { fontWeight: 800, color: "#000000" },
    h4: { fontWeight: 800, color: "#000000" },
    h5: { fontWeight: 800, color: "#000000" },
    h6: { fontWeight: 800, color: "#000000" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#558b2f", 
          color: "#ffffff", // White text on #558b2f passes contrast (approx 4.6:1)
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(0,0,0,0.08)",
          backgroundColor: "#ffffff",
        }
      }
    }
  },
});

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Login dialog component
const LoginDialog = ({ open, onClose, onLogin, onCreateNewUser }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
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

// Sidebar component
const Sidebar = ({ isLoggedIn, handleDrawerClose, collapsed, onToggle }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const icons = [
    <HomeOutlinedIcon key="home" />,
    <InfoOutlinedIcon key="info" />,
    <CalendarMonthOutlinedIcon key="calendar" />,
    <BedtimeOutlinedIcon key="bedtime" />,
    <ManageAccountsOutlinedIcon key="accounts" />,
    <BarChartIcon key="bar" />,
    <LocationOnOutlinedIcon key="location" />,
    <BuildOutlinedIcon key="build" />,
    <CleaningServicesIcon key="cleaning1" />,
    <CleaningServicesIcon key="cleaning2" />,
    <FactCheckOutlinedIcon key="factcheck" />,
    <AdminPanelSettingsOutlinedIcon key="admin" />,
  ];

  const routes = [
    { key: "front_sidebar_1", path: "/etusivu", icon: icons[0] },
    { key: "front_sidebar_2", path: "/christina_regina", icon: icons[1] },
    { key: "front_sidebar_3", path: "/varaukset", icon: icons[2] },
    {
      key: "front_sidebar_4",
      path: "/ykv",
      icon: icons[3],
      requiresLogin: true,
    },
    {
      key: "front_sidebar_5",
      path: "/omat_tiedot",
      icon: icons[4],
      requiresLogin: true,
    },
    {
      key: "front_sidebar_6",
      path: "/tilastot",
      icon: icons[5],
      requiresLogin: true,
    },
    { key: "front_sidebar_7", path: "/yhteystiedot", icon: icons[6] },
    {
      key: "front_sidebar_8",
      path: "/viat",
      icon: icons[7],
      requiresLogin: true,
    },
    {
      key: "front_sidebar_9",
      path: "/siivousvuorot",
      icon: icons[8],
      requiresLogin: true,
    },
    {
      key: "front_sidebar_12",
      path: "/siivoustarvikkeet",
      icon: icons[8],
      requiresLogin: true,
    },
    { key: "front_sidebar_10", path: "/saannot_ja_ohjeet", icon: icons[9] },
    { key: "front_sidebar_11", path: "/tietosuojaseloste", icon: icons[10] },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ padding: collapsed ? "8px" : "16px", width: "100%", textAlign: 'center' }}>
        <Link to="/" onClick={handleDrawerClose}>
          <img
            src={matlu}
            alt="logo"
            style={{
              height: collapsed ? "40px" : "auto",
              width: collapsed ? "40px" : "100%",
              objectFit: 'contain'
            }}
          />
        </Link>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, overflowX: 'hidden' }}>
        {routes.map(({ key, path, requiresLogin }, index) => {
          if (requiresLogin && !isLoggedIn) return null;
          const content = (
            <ListItem key={key} disablePadding sx={{ display: 'block', px: 1, py: 0.5 }}>
              <ListItemButton
                key={key}
                component={Link}
                to={path}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === path ? "secondary.main" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === path ? "secondary.main" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onClick={handleDrawerClose}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: location.pathname === path ? "text.primary" : "text.secondary",
                  }}
                >
                  {icons[index]}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={t(key)}
                    slotProps={{
                      primary: {
                        sx: {
                          color: location.pathname === path ? "text.primary" : "text.primary",
                          fontWeight: location.pathname === path ? 600 : 400,
                        },
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );

          return collapsed ? (
            <Tooltip key={key} title={t(key)} placement="right">
              {content}
            </Tooltip>
          ) : content;
        })}
        <Divider />
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={onToggle}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: 'center',
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={collapsed ? t("expand") : t("collapse")} />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

const AppContent = ({ window }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  const currentDrawerWidth = collapsed ? 64 : 240;

  // Removed unused showLoginPage state
  const { user: loggedUser, setUser } = useStateContext();
  const isLoggedIn = !!loggedUser;

  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);

  const [language, setLanguage] = React.useState(
    localStorage.getItem("lang") || "fi",
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElLang, setAnchorElLang] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    i18n.changeLanguage(localStorage.getItem("lang") || "fi");
  }, []);

  // Handles the sidebar closing on mobile
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
    // No-op: showLoginPage state removed
  };

  // Sets login dialog state only
  const handleLogin = () => {
    setLoginDialogOpen(false); // Close the dialog upon successful login
  };

  // Removes user from context and navigates to front page
  const handleLogout = () => {
    setUser(null);
    navigate("/etusivu"); // Navigate to front page after logging out
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
    localStorage.setItem("lang", lang);
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

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#484643",
          width: { xs: '100%', sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { xs: 0, sm: `${currentDrawerWidth}px` },
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "white" }} // Change color to white
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color={"white"}>
            Ilotalo 3.0
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="primary" onClick={handleIconClick}>
            <TranslateIcon color="primary" sx={{ color: "white" }} />
          </IconButton>
          <Menu
            anchorEl={anchorElLang}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={() => handleLangChange("fi")}>Suomi</MenuItem>
            <MenuItem onClick={() => handleLangChange("en")}>English</MenuItem>
          </Menu>
          {isLoggedIn ? (
            <>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ marginLeft: "auto" }}
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
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
        aria-label="mailbox folders"
      >
        <SwipeableDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onOpen={handleDrawerToggle}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240, // Keep mobile drawer full width
            },
          }}
        >
          <Sidebar
            isLoggedIn={isLoggedIn}
            handleDrawerClose={handleDrawerClose}
            collapsed={false}
            onToggle={() => { }}
          />
        </SwipeableDrawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              overflowX: 'hidden',
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            },
          }}
          open
        >
          <Sidebar
            isLoggedIn={isLoggedIn}
            handleDrawerClose={handleDrawerClose}
            collapsed={collapsed}
            onToggle={handleToggleCollapse}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', sm: `calc(100% - ${currentDrawerWidth}px)` },
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/etusivu" element={<FrontPage />} />
          <Route path="/christina_regina" element={<ChristinaRegina />} />
          <Route path="/varaukset" element={<Reservations />} />
          <Route path="/ykv" element={<OwnKeys />} />
          <Route path="/omat_tiedot" element={<OwnPage />} />
          <Route path="/tilastot" element={<Statistics />} />
          <Route path="/yhteystiedot" element={<Contacts />} />
          <Route path="/viat" element={<DefectFault />} />
          <Route path="/siivousvuorot" element={<CleaningSchedule />} />
          <Route path="/saannot_ja_ohjeet" element={<Rules_and_Instructions />} />
          <Route path="/tietosuojaseloste" element={<PrivacyPolicy />} />
          <Route path="/siivoustarvikkeet" element={<CleaningSupplies />} />
        </Routes>
        <LoginDialog
          open={loginDialogOpen}
          onClose={closeLoginDialog}
          onLogin={handleLogin}
          onCreateNewUser={handleCreateNewUser}
        />
      </Box>
    </Box>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  </ThemeProvider>
);

export default App;
