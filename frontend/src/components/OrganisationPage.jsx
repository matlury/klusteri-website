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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteIcon from '@mui/icons-material/Delete';


const OrganisationPage = ({
  hasPermissionOrg,
  handleOrganizationDetails,
  handleDeleteOrganization
}) => {

  const [allOrganisations, setAllOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  
  const [organisation_new_name, setOrganisationNewName] = useState("");
  const [organisation_new_homepage, setOrganisationNewHomePage] = useState("");
  const [organisation_new_email, setOrganisationNewEmail] = useState("");
  const [organisation_new_color, setOrganizationNewColor] = useState("");
  const [organisation_id, setOrganisationId] = useState("");
  const [organisation_keys, setOrganisationKeys] = useState("");

  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleOrgDetails = (orgId) => {
    const showThisOrg = allOrganisations.find((org) => org.id === orgId);

    setOrganisationNewName(showThisOrg.Organisaatio)
    setOrganisationNewHomePage(showThisOrg.kotisivu)
    setOrganisationNewEmail(showThisOrg.email)
    setOrganizationNewColor(showThisOrg.color)
    setOrganisationId(showThisOrg.id)
    setOrganisationKeys(showThisOrg.Avaimia)
    handleClickOpen();
  };

  useEffect(() => {
    axiosClient
      .get("listobjects/organizations/")
      .then((res) => {
        const orgData = res.data.map((u) => ({
          id: u.id,
          Organisaatio: u.name,
          email: u.email,
          kotisivu: u.homepage,
          color: u.color,
          Avaimia: u.user_set.length,

        }));
        setAllOrganisations(orgData);
        
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFormSubmit = (event) => {
     event.preventDefault();
     handleOrganizationDetails(organisation_new_name, organisation_new_email, organisation_new_homepage, organisation_id);
     handleClose();
   };

  const handleDelete = (organisation_id) => {
    handleDeleteOrganization(organisation_id);
    handleClose();
  }

  const columns = [
    {
      field: "actions",
      headerName: t("edit"),
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          className="modify_org"
          id="modify_org"
          onClick={() => toggleOrgDetails(params.id)}
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
    { field: "Organisaatio", headerName: t("name"), width: 150 },
    { field: "kotisivu", headerName: t("homepage"), width: 200 },
    { field: "email", headerName: t("email"), width: 200 },
    { field: "Avaimia", headerName: t("keys"), width: 80 },    
  ];

  return (
    <div>
      <h4>{t("resp_orgs")}</h4>
      <div>
        <DataGrid
          rows={allOrganisations}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
     {hasPermissionOrg === true && (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("editorg")}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label={t("name")}
              id="organization_name"
              type="organ"
              value={organisation_new_name}
              onChange={(e) => setOrganisationNewName(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
            />
            <TextField
              label={t("email")}
              id="organization_new_email"
              type="organ"
              value={organisation_new_email}
              onChange={(e) => setOrganisationNewEmail(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
            />
            <TextField
              label={t("homepage")}
              id="organization_homepage"
              type="organ"
              value={organisation_new_homepage}
              onChange={(e) => setOrganisationNewHomePage(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
            />
            <TextField
              label={t("color")}
              id="organization_new_color"
              type="organ"
              value={organisation_new_color}
              onChange={(e) => setOrganizationNewColor(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1rem' }} // Add spacing below the field
            />
        </form> 
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            style={{ backgroundColor: 'red', color: 'white' }}
            className="delete-org-button"
            onClick={() => handleDelete(organisation_id)}
          >
            <DeleteIcon /> {t("delete")}
          </Button>
          <div style={{ flexGrow: 1 }} /> {/* Add space to push buttons to opposite ends */}
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            id="confirm_org_change"
            className="confirm_org_change"
            onClick={handleFormSubmit}
          >
            {t("confirmchanges")}
          </Button>
        </DialogActions>
      </Dialog>
       )}
      </div>
  )
};


export default OrganisationPage;
