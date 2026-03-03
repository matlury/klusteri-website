import { authAPI } from "../api/api.ts";

// Handles the login function
const login = async ({ email, password, setError, onLogin, setUser, t }) => {
  const credentials = {
    email: email,
    password: password,
  };

  // Return a promise that resolves when login is complete
  return authAPI
    .login(credentials)
    .then(() => {
      return authAPI
        .getUserInfo()
        .then((response) => {
          // Update context with user data
          setUser(response.data);
          // Set session flag to enable hydration on refresh
          localStorage.setItem("hasSession", "true");
          if (typeof onLogin === 'function') {
            onLogin();
          }
        });
    })
    .catch((err) => {
      const response = err.response;
      if (response && response.status === 422) {
        setError(response.data.message);
      } else {
        setError(t("faillogin"));
      }
      throw err;
    });
};

export default login;
