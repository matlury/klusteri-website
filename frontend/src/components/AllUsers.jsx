import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AllUsers = ({
  handleUpdateAnotherUser,
  hasPermissionOrg,
  hasPermission,
  handlePJChange
}) => {

  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);
  
  
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [telegram, setTelegram] = useState("");
  // const [role, setRole] = useState("");
  // const [userId, setUserId] = useState("");
  // const [organizations, setOrganizations] = useState("");

   //pitäisi ehkä olla näin, mutta tällä tulee herja role not defined rivi 145 
  const [userDetailsUsername, setUserDetailsUsername] = useState("");
  const [userDetailsEmail, setuserDetailsEmail] = useState("");
  const [userDetailsTelegram, setuserDetailsTelegram] = useState("");
  const [userDetailsRole, setuserDetailsRole] = useState("");  
  const [userDetailsOrganizations, setuserDetailsOrganizations] = useState("");
  const [userDetailsId, setuserDetailsId] = useState("");





  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleUserDetails = (userId) => {
    const showThisUser = allUsers.find((user) => user.id === userId);
    //pitäisi ehkä olla näin, mutta tällä tulee herja role not defined rivi 145 
    setUserDetailsUsername(showThisUser.Käyttäjänimi)
    setuserDetailsEmail(showThisUser.email)
    setuserDetailsTelegram(showThisUser.Telegram)
    setuserDetailsRole(showThisUser.Rooli)
    setuserDetailsId(showThisUser.id)
    console.log("showuserID", showThisUser.id, userDetailsId)   // miksi ei settaa yllä??
    setuserDetailsOrganizations(showThisUser.Jäsenyydet.join(", "))
    handleClickOpen();

    // setUsername(showThisUser.Käyttäjänimi);
    // setEmail(showThisUser.email);
    // setTelegram(showThisUser.Telegram);
    // setRole(showThisUser.Rooli);
    // setUserId(showThisUser.id)
    // console.log("userID", userId)
    // setOrganizations(showThisUser.Jäsenyydet.join(", "));
    // handleClickOpen();
  };

  useEffect(() => {
    axiosClient
      .get("listobjects/users/")
      .then((res) => {
        const userData = res.data.map((u) => ({
          id: u.id,
          Käyttäjänimi: u.username,
          email: u.email,
          Telegram: u.telegram,
          Rooli: u.role,
          Jäsenyydet: u.keys.map((organization) => organization.name),
        }));
        //console.log("Allusers", userData)
        setAllUsers(userData);
        
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFormSubmit = (event) => {
    //event.preventDefault();
    // Call the handleUpdateAnotherUser function with the user details
    handleUpdateAnotherUser(userDetailsId, {
      username: userDetailsUsername,
      email: userDetailsEmail,
      telegram: userDetailsTelegram,
      role: userDetailsRole,
      organizations: userDetailsOrganizations.split(", ").map(org => org.trim()),
    });
    handleClose();
  };




  const columns = [
    {
      field: "actions",
      headerName: "Muokkaa/Siirrä PJ-oikeudet",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          //onClick={() => toggleUserDetails(params.row.id)}   // vai params.id
          onClick={() => toggleUserDetails(params.id)}
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
    { field: "Käyttäjänimi", headerName: "Käyttäjänimi", width: 150 },
    { field: "email", headerName: "Sähköposti", width: 200 },
    { field: "Telegram", headerName: "Telegram", width: 200 },
    { field: "Rooli", headerName: "Rooli", width: 80 },
    { field: "Jäsenyydet", headerName: "Jäsenyydet", width: 200 },
    
  ];

  return (
    <div>
      <h4>Käyttäjät</h4>
      <div>
        <DataGrid
          rows={allUsers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Muokkaa tai lisää PJ-oikeudet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Muokkaa käyttäjän tietoja ja/tai lisää PJ-oikeudet.
          </DialogContentText>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Käyttäjänimi"
              id="user_new_username"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
              value={userDetailsUsername}
              onChange={(e) => setUserDetailsUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Sähköposti"
              id="user_new_email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              value={userDetailsEmail}
              onChange={(e) => setuserDetailsEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Telegram"
              id="user_new_telegram"
              // value={telegram}
              // onChange={(e) => setTelegram(e.target.value)}
              value={userDetailsTelegram}
              onChange={(e) => setuserDetailsTelegram(e.target.value)}
              fullWidth
            />
            <TextField
              label="Rooli"
              id="user_new_role"
              // value={role}
              // onChange={(e) => setRole(e.target.value)}
              value={userDetailsRole}
              onChange={(e) => setuserDetailsRole(e.target.value)}
              fullWidth
            />
            <TextField
              label="Jäsenyydet"
              // value={organizations}
              // onChange={(e) => setOrganizations(e.target.value)}
              value={userDetailsOrganizations}
              onChange={(e) => setuserDetailsOrganizations(e.target.value)}
              fullWidth
            />
          {/* </form> */}
        {/* </DialogContent> */}
        <DialogActions>
          <Button onClick={handleClose}>Peruuta</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // /*onClick={handleClose} // Implement the logic for saving changes */
            // //onClick={handleUpdateAnotherUser}  // pitäisi lähettää userid ei nyt tee sitä
            // /*onClick={() => handleUpdateAnotherUser(userId)}*/
          >
            Vahvista muutokset
          </Button>
        </DialogActions>
        </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsers;
