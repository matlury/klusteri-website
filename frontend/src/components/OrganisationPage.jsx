import React, { useState, useEffect } from "react";
import OrganizationDetails from "./OrganizationDetails";
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

const OrganisationPage = ({
  selectedOrg,
  hasPermissionOrg,
  handleOrganizationDetails,
  hasPermission,
  handleDeleteOrganization

}) => {

  const [allOrganisations, setAllOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  
  const [organisation_new_name, setOrganisationNewName] = useState("");
  const [organisation_new_homepage, setOrganisationNewHomePage] = useState("");
  const [organisation_new_email, setOrganisationNewEmail] = useState("");
  const [organisation_id, setOrganisationId] = useState("");
  const [organisation_keys, setOrganisationKeys] = useState("");


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
      headerName: "Muokkaa",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          className="modify_org"
          id="modify_org"
          onClick={() => toggleOrgDetails(params.id)}
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
    { field: "Organisaatio", headerName: "Nimi", width: 150 },
    { field: "kotisivu", headerName: "Kotisivu", width: 200 },
    { field: "email", headerName: "Sähköposti", width: 200 },
    { field: "Avaimia", headerName: "Avaimia", width: 80 },    
  ];

  return (
    <div>
      <h4>Järjestöt</h4>
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
        <DialogTitle>Muokkaa järjestöä</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Organisaation nimi"
              id="organization_name"
              type="organ"
              value={organisation_new_name}
              onChange={(e) => setOrganisationNewName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Sähköposti"
              id="organization_new_email"
              type="organ"
              value={organisation_new_email}
              onChange={(e) => setOrganisationNewEmail(e.target.value)}
              fullWidth

            />
            <TextField
              label="Kotisivu"
              id="organization_homepage"
              type="organ"
              value={organisation_new_homepage}
              onChange={(e) => setOrganisationNewHomePage(e.target.value)}
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
            id="confirm_org_change"
            className="confirm_org_change"
          >
            Vahvista muutokset
          </Button>
          <Button 
            variant="contained"
            color="secondary"
            className="delete-org-button"
            onClick={() => handleDelete(organisation_id)}
            >Poista järjestö
            </Button>
        </DialogActions>
        </form> 
        </DialogContent>
      </Dialog>
       )}
      </div>
  )
};


export default OrganisationPage;
