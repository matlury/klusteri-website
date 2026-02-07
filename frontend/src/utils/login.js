import { authAPI } from "../api/api.ts";

// Handles the login function
const login = async ({ email, password, setError, setToken, onLogin, setUser, t }) => {
  const credentials = {
    email: email,
    password: password,
  };

  // Return a promise that resolves when login is complete
  return authAPI
    .login(credentials)
    .then(({ data }) => {
      setToken(data.access);
      return authAPI
        .getUserInfo()
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("loggedUser", JSON.stringify(response.data));
          localStorage.setItem("isLoggedIn", true);
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
