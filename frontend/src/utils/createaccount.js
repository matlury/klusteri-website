import { usersAPI } from "../api/api.ts";

const createaccount = ({
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
    Create user account
    */

  return new Promise((resolve) => {
    const userObject = {
      username,
      password,
      email,
      telegram,
      role: Role.TAVALLINEN,
      organization: null,
      keys: null,
      recaptcha_response: recaptchaResponse
    };
    usersAPI
      .registerUser(userObject)
      .then(() => {
        setUserCreated(true);
        onAccountCreated && onAccountCreated();

        // Set timeout to hide success message after 5 seconds
        setTimeout(() => {
          setUserCreated(false);
        }, 5000);
        setShowLoginPage(true);
        resolve(true);
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        // Handle specific validation errors from backend
        if (error.response && error.response.data) {
          const errors = error.response.data;
          if (errors.email) {
            resolve(t("emailinuse"));
            return;
          }
          if (errors.username) {
            resolve(t("usernameinuse"));
            return;
          }
          if (errors.telegram) {
            resolve(t("telegraminuse"));
            return;
          }
        }
        resolve(t("errorcreate"));
      });
  });
};

export default createaccount;
