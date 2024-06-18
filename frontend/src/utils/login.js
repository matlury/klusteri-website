import axiosClient from "../axios.js";

// Handles the login function
const login = async ({ email, password, setError, setToken, onLogin, setUser, t }) => {
  const credentials = {
    email: email,
    password: password,
  };

  // Return a promise that resolves when login is complete
  return axiosClient
    .post("/token/", credentials)
    .then(({ data }) => {
      setToken(data.access);
      return axiosClient
        .get("/users/userinfo", {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("loggedUser", JSON.stringify(response.data));
          localStorage.setItem("isLoggedIn", true);
          onLogin();
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
