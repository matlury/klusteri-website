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
    setUserDetailsUsername(showThisUser.Käyttäjänimi)
    setuserDetailsEmail(showThisUser.email)
    setuserDetailsTelegram(showThisUser.Telegram)
    setuserDetailsRole(showThisUser.Rooli)
    setuserDetailsId(showThisUser.id)
    console.log("showuserID", showThisUser.id, userDetailsId)
    setuserDetailsOrganizations(showThisUser.Jäsenyydet.join(", "))
    handleClickOpen();
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
        setAllUsers(userData);
        
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleUpdateAnotherUser(userDetailsId, userDetailsUsername, userDetailsEmail, userDetailsTelegram, userDetailsRole,
      userDetailsOrganizations.split(", ").map(org => org.trim()),);
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
              value={userDetailsUsername}
              onChange={(e) => setUserDetailsUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Sähköposti"
              id="user_new_email"
              value={userDetailsEmail}
              onChange={(e) => setuserDetailsEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Telegram"
              id="user_new_telegram"
              value={userDetailsTelegram}
              onChange={(e) => setuserDetailsTelegram(e.target.value)}
              fullWidth
            />
            <TextField
              label="Rooli"
              id="user_new_role"
              value={userDetailsRole}
              onChange={(e) => setuserDetailsRole(e.target.value)}
              fullWidth
            />
            {/* <TextField
              label="Jäsenyydet"
              // value={organizations}
              // onChange={(e) => setOrganizations(e.target.value)}
              value={userDetailsOrganizations}
              onChange={(e) => setuserDetailsOrganizations(e.target.value)}
              fullWidth
            /> */}
          {/* </form> */}
        {/* </DialogContent> */}
        <DialogActions>
          <Button onClick={handleClose}>Peruuta</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
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
