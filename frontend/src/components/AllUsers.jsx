import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios.js";
import { DataGrid } from "@mui/x-data-grid";
import UserDetails from "./UserDetails";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
} from "@mui/material";



// Shows all users
const AllUsers = (
    ) => {

  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleFormSubmit = (event) => {
    event.preventDefault();
    //const formData = new FormData(event.currentTarget);
    //const formJson = Object.fromEntries(formData.entries());
    //const email = formJson.email;
    //console.log(email);
    //handleYkvLogin(); // Call handleYkvLogin if needed
    handleClose(); // Close the dialog
  };

  const columns = [
    { field: "Käyttäjänimi", headerName: "Käyttäjänimi", width: 150 },
    { field: "email", headerName: "Sähköposti", width: 200 },
    { field: "Telegram", headerName: "Telegram", width: 200 },
    { field: "Rooli", headerName: "Rooli", width: 80 },
    { field: "Jäsenyydet", headerName: "Jäsenyydet", width: 200 },
    {
      field: "actions",
      headerName: "Muokkaa/Siirrä PJ-oikeudet",
      width: 200,
      renderCell: (params) => (
        <React.Fragment>
        <Button
          variant="contained"
          className="login-button"
          color="primary"
          onClick={handleClickOpen}
          data-testid="opencreateform"
          >
          <EditOutlinedIcon/>
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleFormSubmit,
          }}
          >
            <DialogTitle>Muokkaa tai lisää PJ-oikeudet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Muokkaa käyttäjän tietoja ja/tai lisää PJ-oikeudet.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Peruuta</Button>
                <Button
                  type="submit"
                  className="create-user-button"    /*nämä pitää päivittää vastaamaan käyttäjän tietojen muutosta ja PJ-lisäystä*/
                  data-testid="createresponsibility"
                  id="takeresp"
                >
                  Vahvista muutokset
                </Button>
              </DialogActions>



          </Dialog>
       </React.Fragment>
       ),
    }
    ];
  

  useEffect(() => {
  //const getAllUsers = () => {
    axiosClient
      .get("listobjects/users/")

        .then((res) => {
            const data = res.data;
            console.log("data", data)
          const userData = res.data.map((u, index) => ({
            id: u.id, // DataGrid requires a unique 'id' for each row
            Käyttäjänimi: u.username,
            email: u.email,
            Telegram: u.telegram, 
            Rooli: u.role,
            Jäsenyydet: u.keys.map(
              (organization) => organization.name,)
  
          }));
          setAllUsers(userData);
        })
        .catch((error) => console.error(error));
    }, []);


  return (
    <div>
      <p></p>
      <h4>Käyttäjät</h4>
      <div>
      <DataGrid
            rows={allUsers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
            {/* {
              <UserDetails
                allUsers={allUsers}
                userId={user.id}
                userDetailsUsername={userDetailsUsername}
                setUserDetailsUsername={setUserDetailsUsername}
                userDetailsEmail={userDetailsEmail}
                setuserDetailsEmail={setuserDetailsEmail}
                userDetailsTelegram={userDetailsTelegram}
                userDetailsRole={userDetailsRole}
                setuserDetailsRole={setuserDetailsRole}
                userDetailsOrganizations={userDetailsOrganizations}
                hasPermissionOrg={hasPermissionOrg}
                handleUpdateAnotherUser={handleUpdateAnotherUser}
                hasPermission={hasPermission}
                handlePJChange={handlePJChange}
                selectedUser={selectedUser}
              />
            } */}
            </div>
    );
  };
  

export default AllUsers;
