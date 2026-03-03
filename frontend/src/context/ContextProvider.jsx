import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";

// Creates a context for managing global application state
const StateContext = createContext({
  user: null,
  token: null,
  notification: null,
  timeLeft: null,

  // Functions to update state values
  setUser: () => { },
  setToken: () => { },
  setNotification: () => { },
  setTimeLeft: () => { },
});

// ContextProvider component to provide state to child components
export const ContextProvider = ({ children, initialUser = null, skipHydration = false }) => {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // Hydrate user from server on app mount using HttpOnly cookie
  useEffect(() => {
    if (skipHydration) {
      return;
    }
    // Only fetch if we have reason to believe a session exists (set during login)
    if (localStorage.getItem("hasSession") !== "true") {
      return;
    }
    const hydrateUser = async () => {
      try {
        const response = await authAPI.getUserInfo();
        setUser(response.data);
      } catch (error) {
        // Not authenticated or session expired; user remains null
        setUser(null);
        localStorage.removeItem("hasSession");
      }
    };
    hydrateUser();
  }, [skipHydration]);

  useEffect(() => {
    // Timer logic to decrement timeLeft every second
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []);

  const updateToken = (token) => {
    setToken(token);
  };

  const updateNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Provide state values and update functions to child components
  return (
    <StateContext.Provider
      value={{
        user,
        token,
        notification,
        timeLeft,
        setUser,
        setToken: updateToken,
        setNotification: updateNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to access context values in functional components
export const useStateContext = () => useContext(StateContext);
