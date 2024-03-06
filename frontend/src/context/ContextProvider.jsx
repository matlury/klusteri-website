import { createContext, useContext, useState, useEffect } from "react";

// Creates a context for managing global application state
const StateContext = createContext({
    user: null,
    token: null,
    notification: null,

    // Functions to update state values
    setUser: () => { },
    setToken: () => { },
    setNotification: () => { },
});

// ContextProvider component to provide state to child components
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedUser')) || null)
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN') || null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem('loggedUser', JSON.stringify(user));
      }, [user])

    const updateToken = (token) => {
        setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

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
