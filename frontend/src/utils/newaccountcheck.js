import { usersAPI } from "../api/api.ts";

const newaccountcheck = ({
  username,
  password,
  email,
  telegram,
  confirmPassword,
  t
}) => {
  /*
    Check that username, password, email
    and confirm password are not empty
    */
  if (!username || !password || !email || !confirmPassword) {
    return t("mandfields");
  }

  /*
    Check that the username are not space
    */
  if (!/^[a-zA-Z0-9.\-_$@*!]{1,20}$/.test(username)) {
    return t("mincharsusername");
  }

  /*
    Check that the username does not contain a @ symbol
    */
  if (/@/.test(username)) {
    return t("noatsymbol");
  }

  /*
    Check that the password and
    confirm password are the same
    */
  if (password !== confirmPassword) {
    return t("diffpass");
  }

  /*
    Check that the email is valid
    */
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    )
  ) {
    return t("invalidemail");
  }

  /*
    Check that the password is 
    8-20 characters long
    */
  if (password.length < 8 || password.length > 20) {
    return t("mincharspass");
  }

  /*
    Check that the password is not
    only numbers
    */
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return t("invalidpass");
  }

  /*
    Check if telegram is provided (uniqueness checked by backend)
    */
  if (telegram) {
    // Telegram validation is now handled by the backend
    return true;
  } else {
    // Proceed with account creation
    return true;
  }
};

export default newaccountcheck;
