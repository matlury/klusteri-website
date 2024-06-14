import axiosClient from "../axios.js";

// Handles the login function
const login = ({ email, password, setError, setToken, onLogin, setUser, t }) => {
  const credentials = {
    email: email,
    password: password,
  };

  // Checks if the credentials match using tokens, and if the user is authenticated it saves the logged user to local storage
  axiosClient
    .post("/token/", credentials)
    .then(({ data }) => {
      setToken(data.access);
      axiosClient
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
    });
};

export default login;
