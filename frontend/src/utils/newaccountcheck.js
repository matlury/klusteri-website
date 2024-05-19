import axios from "axios";

const newaccountcheck = ({
  username,
  password,
  email,
  telegram,
  confirmPassword,
  API_URL,
}) => {
  /*
    Check that username, password, email
    and confirm password are not empty
    */
  if (!username || !password || !email || !confirmPassword) {
    return "Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.";
  }

  /*
    Check that the username are not space
    */
  if (!/^[a-zA-Z0-9.\-_$@*!]{1,20}$/.test(username)) {
    return "Käyttäjänimen tulee olla enintään 20 merkkiä eikä saa sisältää välilyöntejä.";
  }

  /*
    Check that the password and
    confirm password are the same
    */
  if (password !== confirmPassword) {
    return "Salasanat eivät täsmää.";
  }

  /*
    Check that the email is valid
    */
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    )
  ) {
    return "Viheellinen sähköposti osoite.";
  }

  /*
    Check that the password is 
    8-20 characters long
    */
  if (password.length < 8 || password.length > 20) {
    return "Salasanan tulee olla 8-20 merkkiä pitkä.";
  }

  /*
    Check that the password is not
    only numbers
    */
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.";
  }

  /*
    Check if telegram is provided and unique
    */
  if (telegram) {
    return new Promise((resolve) => {
      axios
        .get(`${API_URL}/api/listobjects/users/?telegram=${telegram}`)
        .then((response) => {
          const existingUsers = response.data;
          if (existingUsers.some((user) => user.telegram === telegram)) {
            resolve("Telegram on jo käytössä.");
          } else {
            // Proceed with account creation
            resolve(true);
          }
        })
        .catch((error) => {
          console.error("Error checking telegram:", error);
          resolve("Virhe tarkistettaessa telegramia.");
        });
    });
  } else {
    // Proceed with account creation
    return true;
  }
};

export default newaccountcheck;
