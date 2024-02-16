import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,

    setUser: () => { },
    setToken: () => { },
    setNotification: () => { },
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN') || null);
    const [notification, setNotification] = useState(null);


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

export const useStateContext = () => useContext(StateContext);
