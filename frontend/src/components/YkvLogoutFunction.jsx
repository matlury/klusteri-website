import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete } from "@mui/material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const YkvLogoutFunction = ({ handleYkvLogin, responsibility, setResponsibility, handleYkvLogout, selectedIds }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [search, setSearch] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemove = (id) => {
    handleYkvLogout(selectedIds);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setConfirmOpen(false);
  };

  const handleLogoutClick = (id, name) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setConfirmOpen(true);
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Uloskirjaus',
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleLogoutClick(params.id, params.row.Vastuussa)}
        >
          <LogoutOutlinedIcon />
        </Button>
      ),
    },
    { field: 'Vastuuhenkilö', headerName: 'Vastuuhenkilö', width: 170 },
    { field: 'Vastuussa', headerName: 'Vastuussa', width: 200 },
    { field: 'YKV_sisäänkirjaus', headerName: 'YKV sisäänkirjaus', width: 220 },
    { field: 'Organisaatiot', headerName: 'Organisaatiot', width: 220 },
  ];


  const columns_2 = [
    
    { field: 'Vastuuhenkilö', headerName: 'Vastuuhenkilö', width: 170 },
    { field: 'Luonut', headerName: 'Luonut', width: 220 },
    { field: 'Vastuussa henkilöistä', headerName: 'Vastuussa henkilöistä', width: 200 },
    { field: 'YKV_sisäänkirjaus', headerName: 'YKV sisäänkirjaus', width: 220 },
    { field: 'YKV_uloskirjaus', headerName: 'YKV uloskirjaus', width: 220 },
  ];

  useEffect(() => {
    axiosClient
      .get("/listobjects/nightresponsibilities/")   // pitääkö olla aktiivisista, ks. ownkeys rivi 200
      .then((res) => {
        const userData = res.data.map((u, index) => ({
          id: index, // DataGrid requires a unique 'id' for each row
          Vastuuhenkilö: u.user.username,
          Vastuussa: u.responsible_for,
          YKV_sisäänkirjaus: u.login_time, // Assuming login_time is available
          Organisaatiot: u.organizations.map(organization => organization.name), // Assuming login_time is available
        }));
        setUsers(userData);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleYkvLogin(); // Call handleYkvLogin if needed
    handleClose(); // Close the dialog
  };

  const filteredUsers = users.filter(user =>
    user.Vastuussa.toLowerCase().includes(search.toLowerCase())
  );

  return loading ? (
    <div>Lataa...</div>
  ) : (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Aktiiviset</h2>
      <React.Fragment>
        <Button variant="contained" className="login-button" color="primary" onClick={handleClickOpen}>
          + Ota vastuu
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: handleFormSubmit,
          }}
        >
          <DialogTitle>Ota vastuu</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Kirjaa sisään YKV-valvontaan henkilöitä ja ota vastuu.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="responsibility"
              type="text"
              label="Kenestä otat vastuun?"
              value={responsibility}
              fullWidth
              variant="standard"
              onChange={(e) => setResponsibility(e.target.value)}
            />

            <Autocomplete
              id="combo-box-demo"
              options={users}
              getOptionLabel={(option) => option.Vastuuhenkilö}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Kirjaa toisen käyttäjän puolesta" variant="standard" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Peruuta</Button>
            <Button
              type="submit"
              className="create-user-button"
            >
              Ota vastuu
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <TextField
        label="Hae vastuussa"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataGrid
        rows={filteredUsers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
      >
        <DialogTitle>Vahvista YKV uloskirjaus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Oletko varma, että haluat kirjata ulos henkilön {selectedUserName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Peruuta</Button>
          <Button
            onClick={() => handleRemove(selectedUserId)}
            color="primary"
            variant="contained"
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>


      <h2>Kaikki vastuut</h2>
      <DataGrid
        rows={filteredUsers}
        columns={columns_2}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />


    </div>
  
    

  );
};

export default YkvLogoutFunction;
