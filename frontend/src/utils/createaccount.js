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
}) => {
  /*
    Send request to server to check if email is already in use
    */

  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/api/listobjects/users/?email=${email}`)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        const existingUsers = response.data;
        if (existingUsers.some((user) => user.email === email)) {
          resolve("Sähköposti on jo käytössä.");
        } else {
          const userObject = {
            username,
            password,
            email,
            telegram,
            role: 5,
            organization: null,
            keys: null,
          };
          axios
            .post(`${API_URL}/api/users/register`, userObject)
            .then((response) => {
              console.log(response);
              console.log("Account created successfully!");
              setUserCreated(true);
              onAccountCreated && onAccountCreated();

              // Set timeout to hide success message after 5 seconds
              setTimeout(() => {
                setUserCreated(false);
              }, 5000);
            })
            .catch((error) => {
              console.error("Error creating account:", error);
              resolve("Virhe luotaessa käyttäjää.");
            });
          setShowLoginPage(true);
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        resolve("Virhe tarkistettaessa sähköpostia.");
      });
  });
};

export default createaccount;
