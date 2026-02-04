import axiosClient from "../axios.js";

export const getPermission = async ({ API_URL, setHasPermission }) => {
  /*
        Check if the logged user has permissions for something
        This prevents harm caused by localstorage manipulation
        */

  await axiosClient
    .get(`/users/userinfo`)
    .then((response) => {
      const currentUser = response.data;
      if (currentUser.role === 1) {
        setHasPermission(true);
      } else if (currentUser[0]) {
        if (currentUser[0].role === 1) {
          setHasPermission(true);
        }
      } else {
        setHasPermission(false);
      }
    });
};

// fetch each user with keys if someone is logged in
export const fetchAllUsersWithKeys = async ({
  API_URL,
  setAllUsersWithKeys,
  loggedUser,
  allResponsibilities,
}) => {
  try {
    const response = await axiosClient.get(`/listobjects/users/`);
    const rawData = response.data;
    const filteredUsers = rawData.filter((user) =>
      checkUser(user, loggedUser, allResponsibilities),
    );
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
  return true;
};
