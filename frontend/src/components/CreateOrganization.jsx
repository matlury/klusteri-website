import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

const CreateOrganization = ({
  organization_name,
  setOrganizationName,
  organization_email,
  setOrganizationEmail,
  organization_homepage,
  setOrganizationHomePage,
  organization_color,
  setOrganizationColor,
  handleCreateOrganization,
  setOrganisations,
  organizations,
}) => {
  const { t } = useTranslation();
  // State variables to manage dialog visibility and field validation
  const [open, setOpen] = useState(false);
  const [errorFields, setErrorFields] = useState({});
  const [organisations, setOrganisations] = useState([]);

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle organization creation and close dialog
  const handleCreateAndClose = async () => {
    // Validate fields
    const errors = {};
    if (!organization_name) errors.name = true;
    if (!organization_email) errors.email = true;
    if (!organization_homepage) errors.homepage = true;

    if (Object.keys(errors).length === 0) {
      // All fields are filled, proceed with organization creation
      await handleCreateOrganization();
      await fetchOrganizations();
      handleClose();
    } else {
      // Some required fields are empty, set error state to show notification
      setErrorFields(errors);
    }
  };

  // Function to handle Snackbar close event
  const handleSnackbarClose = () => {
    setErrorFields({});
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await 
      axiosClient.get("listobjects/organizations/")
      const orgData = res.data.map((u) => ({
            id: u.id,
            Organisaatio: u.name,
            email: u.email,
            kotisivu: u.homepage,
            color: u.color,
            Avaimia: u.user_set.length,

      }));
      setOrganisations(orgData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <Button onClick={handleClickOpen} variant="contained" className="open-dialog-button" data-testid="createneworgbutton">
        {t("createneworg")}
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>{t("createneworg")}</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <form>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="name"
                label={t("name")}
                value={organization_name}
                onChange={(e) => setOrganizationName(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.name} // Show error if field is empty
                data-testid="organization-name"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="email"
                label={t("email")}
                className="organization-email"
                value={organization_email}
                onChange={(e) => setOrganizationEmail(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.email} // Show error if field is empty
                data-testid="organization-email"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="homepage"
                label={t("homepage")}
                value={organization_homepage}
                onChange={(e) => setOrganizationHomePage(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.homepage} // Show error if field is empty
                data-testid="organization-homepage"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="color"
                label={t("color")}
                value={organization_color}
                onChange={(e) => setOrganizationColor(e.target.value)}
                fullWidth
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          {t("cancel")}
          </Button>
          <Button onClick={handleCreateAndClose} variant="contained" className="create-organization-button" data-testid="create-organization-button">
          {t("createorg")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Object.keys(errorFields).length > 0}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Kaikki pakolliset kentät tulee täyttää."
      />
    </div>
  );
};

export default CreateOrganization;
