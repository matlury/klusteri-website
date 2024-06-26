import axios from "axios";

const createaccount = ({
  API_URL,
  email,
  username,
  password,
  telegram,
  setUserCreated,
  setShowLoginPage,
  onAccountCreated,
  recaptchaResponse,
  t
}) => {
  /*
    Send request to server to check if email is already in use
    */

  return new Promise((resolve) => {
    axios
      .get(`${API_URL}/api/listobjects/users/?email=${email}`)
      .then((response) => {
        const existingUsers = response.data;
        if (existingUsers.some((user) => user.email === email)) {
          resolve(t("emailinuse"));
          return
        }
        if (existingUsers.some((user) => user.username === username)) {
          resolve(t("usernameinuse"));
          return
        } else {
          const userObject = {
            username,
            password,
            email,
            telegram,
            role: 5,
            organization: null,
            keys: null,
            recaptcha_response: recaptchaResponse
          };
          axios
            .post(`${API_URL}/api/users/register`, userObject)
            .then((response) => {
              setUserCreated(true);
              onAccountCreated && onAccountCreated();

              // Set timeout to hide success message after 5 seconds
              setTimeout(() => {
                setUserCreated(false);
              }, 5000);
            })
            .catch((error) => {
              console.error("Error creating account:", error);
              resolve(t("errorcreate"));
              return
            });
          setShowLoginPage(true);
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        resolve(t("erroremail"));
        return
      });
  });
};

export default createaccount;
