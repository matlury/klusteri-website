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
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";

const AllUsers = ({
  handleUpdateAnotherUser,
  hasPermissionOrg,
  hasPermission,
  handlePJChange,
  handleKeySubmit,
}) => {

  // State variables to manage user data and dialog visibility
  const [allUsers, setAllUsers] = useState([]);
  const [allOrganisations, setAllOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  const [userDetailsUsername, setUserDetailsUsername] = useState("");
  const [userDetailsEmail, setuserDetailsEmail] = useState("");
  const [userDetailsTelegram, setuserDetailsTelegram] = useState("");
  const [userDetailsRole, setuserDetailsRole] = useState("");  
  const [userDetailsOrganizations, setuserDetailsOrganizations] = useState("");
  const [userDetailsId, setuserDetailsId] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const { t } = useTranslation();

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to toggle user details in the dialog
  const toggleUserDetails = (userId) => {
    const showThisUser = allUsers.find((user) => user.id === userId);
    setUserDetailsUsername(showThisUser.Käyttäjänimi);
    setuserDetailsEmail(showThisUser.email);
    setuserDetailsTelegram(showThisUser.Telegram);
    setuserDetailsRole(showThisUser.Rooli);
    setuserDetailsId(showThisUser.id);
    setuserDetailsOrganizations(showThisUser.Jäsenyydet.join(", "));
    handleClickOpen();
  };

  // Fetching user data from the server on component mount
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

  // Fetching organization data from the server on component mount
  useEffect(() => {
    axiosClient
      .get("listobjects/organizations/")
      .then((res) => {
        const orgData = res.data.map((u) => ({
          id: u.id,
          Organisaatio: u.name,
          email: u.email,
          kotisivu: u.homepage,
          Avaimia: u.user_set.length,
        }));
        setAllOrganisations(orgData);
      })
      .catch((error) => console.error(error));
  }, []);

  // Function to handle form submission (updating user details)
  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleUpdateAnotherUser(userDetailsId, userDetailsUsername, userDetailsEmail, userDetailsTelegram, userDetailsRole,
      userDetailsOrganizations.split(", ").map(org => org.trim()));
    handleClose();
  };

  // Columns configuration for the DataGrid component
  const columns = [
    {
      field: "actions",
      headerName: t("edit"),
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          className="modify_user"
          data-testid={`edit-button-${params.id}`}
          onClick={() => toggleUserDetails(params.id)}
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
    { field: "Käyttäjänimi", headerName: t("username"), width: 150 },
    { field: "email", headerName: t("email"), width: 200 },
    { field: "Telegram", headerName: "Telegram", width: 200 },
    { field: "Rooli", headerName: t("role"), width: 80 },
    { field: "Jäsenyydet", headerName: t("resp_orgs"), width: 200 },
    
  ];

  return (
    <div>
      {/* Display DataGrid for users */}
      <h2>{t("users")}</h2>
      <div>
      <DataGrid
          rows={allUsers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      {/* Dialog for editing user details */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("edituser")}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label={t("username")}
              id="user_new_username"
              value={userDetailsUsername}
              onChange={(e) => setUserDetailsUsername(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
              data-testid="username-input"
            />
            <TextField
              label={t("email")}
              id="user_new_email"
              value={userDetailsEmail}
              onChange={(e) => setuserDetailsEmail(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
              data-testid="email-input"
            />
            <TextField
              label="Telegram"
              id="user_new_telegram"
              value={userDetailsTelegram}
              onChange={(e) => setuserDetailsTelegram(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
              data-testid="telegram-input"
            />
            <TextField
              label={t("role")}
              id="user_new_role"
              value={userDetailsRole}
              onChange={(e) => setuserDetailsRole(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
              data-testid="role-input"
            />

            {/* Accordion for organization key */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                data-testid="expand-key-accordion"
              >
                {t("givekey")}
              </AccordionSummary>
              <AccordionDetails>
                <Autocomplete
                  id="combo-box-org"
                  options={allOrganisations}
                  getOptionLabel={(option) => option.Organisaatio}
                  style={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setSelectedOrganization(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label={t("chooseorg")} />}
                  data-testid="organization-autocomplete"
                />
                <Button 
                  variant="contained"
                  className="submit-key-button"
                  data-testid="submit-key-button"
                  onClick={() => handleKeySubmit(userDetailsId, selectedOrganization.Organisaatio)}
                >
                  {t("givekey")}
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Button to change user's role */}
            <Button 
              onClick={() => handlePJChange(userDetailsId)}
              data-testid="change-pj-button"
              sx={{ marginBottom: '1rem' }} // Add spacing below the button
            >
              {t("changepj")}
            </Button>

            {/* Dialog actions */}
            <DialogActions>
              <Button 
                onClick={handleClose}
                data-testid="cancel-button"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-testid="save-button"
              >
                {t("save")}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsers;
