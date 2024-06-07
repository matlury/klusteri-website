import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from "@mui/x-data-grid";
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
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { lighten, styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';

const YkvLogoutFunction = ({
  handleYkvLogin,
  responsibility,
  setResponsibility,
  handleYkvLogout,
  loggedUser,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [search, setSearch] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const [activeUsers, setactiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemove = (id) => {
    handleYkvLogout(id);
    setactiveUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setConfirmOpen(false);
  };

  const handleLogoutClick = (id, name) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setConfirmOpen(true);
  };

  const getBackgroundColor = (color) =>
    lighten(color, 0.7);
  
  const getHoverBackgroundColor = (color) =>
    lighten(color, 0.6);

  const getSelectedBackgroundColor = (color) =>
    lighten(color, 0.5);
  
  const getSelectedHoverBackgroundColor = (color) =>
    lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .late': {
      backgroundColor: getBackgroundColor(theme.palette.error.main),
      transition: 'background-color 0.1s ease',
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.error.main),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(theme.palette.error.main),
        },
      },
    },
    '& .on-time': {
      backgroundColor: getBackgroundColor(theme.palette.success.main),
      transition: 'background-color 0.1s ease',
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.success.main),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.success.main),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(theme.palette.success.main),
        },
      },
    },
  }));

  const columns = [
    {
      field: "actions",
      headerName: "Uloskirjaus",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleLogoutClick(params.id, params.row.Vastuussa)}
          id="removeresp"
        >
          <LogoutOutlinedIcon />
        </Button>
      ),
    },
    { field: "Vastuuhenkilö", headerName: "Vastuuhenkilö", width: 170 },
    { field: "Vastuussa", headerName: "Vastuussa", width: 200 },
    { field: "YKV_sisäänkirjaus", headerName: "Sisäänkirjaus", width: 200 },
    { field: "Organisaatiot", headerName: "Järjestöt", width: 200 },
  ];

  const columns_2 = [
    { field: "Vastuuhenkilö", headerName: "Vastuuhenkilö", width: 170 },
    { field: "created_by", headerName: "Luonut", width: 200 },
    { field: "Vastuussa", headerName: "Vastuussa", width: 200 },
    { field: "YKV_sisäänkirjaus", headerName: "Sisäänkirjaus", width: 200 },
    { field: "logout_time", headerName: "Uloskirjaus", width: 200 },
    { field: "Organisaatiot", headerName: "Järjestöt", width: 200 },
    { field: "late", headerName: "Myöhässä", width: 200, renderCell: (params) => (
      params.row.late ? <AccessTimeIcon /> : <CheckIcon />
    ) },
  ];

  useEffect(() => {
    axiosClient
      .get("/listobjects/nightresponsibilities/")
      .then((res) => {
        const userData = res.data.map((u, index) => ({
          id: u.id, // DataGrid requires a unique 'id' for each row
          Vastuuhenkilö: u.user.username,
          Vastuussa: u.responsible_for,
          YKV_sisäänkirjaus: new Date(u.login_time), // Assuming login_time is available
          Organisaatiot: u.organizations.map(
            (organization) => organization.name,
          ), // Assuming login_time is available
          present: u.present,
          created_by: u.created_by,
          logout_time: u.present ? null : new Date(u.logout_time),
          late: u.late,        
        }));
        setAllUsers(userData);
        setactiveUsers(
          userData.filter(
            (resp) =>
              resp.present === true 
              // &&
              // resp.Vastuuhenkilö == loggedUser.username ||
              // resp.created_by == loggedUser.username,
          ),
        );
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    handleYkvLogin(); // Call handleYkvLogin if needed
    handleClose(); // Close the dialog
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.Vastuussa.toLowerCase().includes(search.toLowerCase()) ||
      user.Vastuuhenkilö.toLowerCase().includes(search.toLowerCase()),
  );

  const ownUsers = allUsers
    .filter(
      (user) =>
        user.Vastuuhenkilö === loggedUser.username ||
        user.created_by === loggedUser.username,
    )
    .filter(
      (user) =>
        user.Vastuussa.toLowerCase().includes(search.toLowerCase()) ||
        user.Vastuuhenkilö.toLowerCase().includes(search.toLowerCase()),
    );

  const getRowClassName = (params) => {
    return params.row.late ? 'late' : 'on-time';
  };

  return loading ? (
    <div>Lataa...</div>
  ) : (
    <div style={{ height: 600, width: "100%" }}>
      <h2>Aktiiviset</h2>
      <React.Fragment>
        <Button
          variant="contained"
          className="login-button"
          color="primary"
          onClick={handleClickOpen}
          data-testid="opencreateform"
        >
          + Ota vastuu
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
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
              data-testid="responsibilityfield"
            />

            <Autocomplete
              id="combo-box-demo"
              options={allUsers}
              getOptionLabel={(option) => option.Vastuuhenkilö}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kirjaa toisen käyttäjän puolesta"
                  variant="standard"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Peruuta</Button>
            <Button
              type="submit"
              className="create-user-button"
              data-testid="createresponsibility"
              id="takeresp"
            >
              Ota vastuu
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <DataGrid
        rows={activeUsers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
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
            id="confirmlogout"
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>

      {loggedUser.role !== 5 && (
        <div>
          <TextField
            label="Hae yökäyttövastuista"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loggedUser.role !== 1 && loggedUser.role !== 5 && (
        <div>
          <h2>Omat vastuut</h2>
          <StyledDataGrid
            rows={ownUsers}
            columns={columns_2}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowClassName={getRowClassName}
          />
        </div>
      )}

      {loggedUser.role === 1 && (
        <div>
          <h2>Kaikki vastuut</h2>
          <StyledDataGrid
            rows={filteredUsers}
            columns={columns_2}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowClassName={getRowClassName}
          />
        </div>
      )}
    </div>
  );
};

export default YkvLogoutFunction;
