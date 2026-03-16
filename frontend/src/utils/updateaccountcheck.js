import { usersAPI } from "../api/api.ts";

const updateAccountCheck = async ({
  username,
  password,
  email,
  telegram,
  confirmPassword,
  t
}) => {
  if (username) {
    if (!/^[a-zA-Z0-9.\-_$@*!]{1,20}$/.test(username)) {
      return t("mincharsusername");
    }
    if (/@/.test(username)) {
      return t("noatsymbol");
    }
  }
  if (password) {
    if (password !== confirmPassword) {
      return t("diffpass");
    }
    if (password.length < 8 || password.length > 20) {
      return t("mincharspass");
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return t("invalidpass");
    }
  }
  if (email) {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    ) {
      return t("invalidemail");
    }
  }
  if (telegram) {
    // Telegram validation is now handled by the backend
    return true;
  } else {
    // Proceed with account editing
    return true;
  }
};

export default updateAccountCheck;