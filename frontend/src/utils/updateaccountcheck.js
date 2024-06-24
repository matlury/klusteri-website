import { gridPaginatedVisibleSortedGridRowEntriesSelector } from "@mui/x-data-grid";
import axios from "axios";

const newaccountcheck = ({
  username,
  password,
  email,
  telegram,
  confirmPassword,
  API_URL,
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
        console.log(password);
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
        return new Promise((resolve) => {
        axios
            .get(`${API_URL}/api/listobjects/users/?telegram=${telegram}`)
            .then((response) => {
            const existingUsers = response.data;
            if (existingUsers.some((user) => user.telegram === telegram)) {
                resolve(t("telegraminuse"));
            } else {
                // Proceed with account creation
                resolve(true);
            }
            })
            .catch((error) => {
            console.error("Error checking telegram:", error);
            resolve(t("errortelegram"));
            });
        });
    }
    // Proceed with account up
    return true;
};

export default newaccountcheck;