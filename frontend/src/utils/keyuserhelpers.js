import axios from "axios";

export const getPermission = async ({ API_URL, setHasPermission }) => {
    /*
        Check if the logged user has permissions for something
        This prevents harm caused by localstorage manipulation
        */

    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    await axios
      .get(`${API_URL}/api/users/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const currentUser = response.data;
        if (currentUser.role === 1) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      });
  };

  // fetch each user with keys if someone is logged in
export const fetchAllUsersWithKeys = async ({ API_URL, allUsersWithKeys, setAllUsersWithKeys, loggedUser, allResponsibilities }) => {
    try {
      const response = await axios.get(`${API_URL}/api/listobjects/users/`);
      const allUsers = response.data;
      const filteredUsers = allUsers.filter((user) => checkUser(user, loggedUser, allResponsibilities));
      setAllUsersWithKeys(filteredUsers);
    } catch (error) {
      console.error("Error fetching users with keys", error);
    }
  };

  // check if a user is valid for making an YKV-login
const checkUser = (user, loggedUser, allResponsibilities) => {
    if (user.role === 5) {
      return false;
    }
    if (user.id === loggedUser.id) {
      return false;
    }
    // check if a user already has an active YKV
    const alreadyLoggedIn = allResponsibilities.filter(
      (resp) => resp.email === user.email && resp.present,
    );
    if (alreadyLoggedIn.length !== 0) {
      return false;
    }
    return true;
  };