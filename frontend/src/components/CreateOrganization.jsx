import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const CreateOrganization = ({
  handleCreateOrganization,
  fetchOrganizations,
}) => {
  const { t } = useTranslation();
  // State variables to manage dialog visibility and field validation
  const [open, setOpen] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  const [organization_name, setOrganizationName] = useState("");
  const [organization_email, setOrganizationEmail] = useState("");
  const [organization_homepage, setOrganizationHomePage] = useState("");
  const [organization_color, setOrganizationColor] = useState("");

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    // Clear fields
    setOrganizationName("");
    setOrganizationEmail("");
    setOrganizationHomePage("");
    setOrganizationColor("");
    setErrorFields({});
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
      const organizationObject = {
        name: organization_name,
        email: organization_email,
        homepage: organization_homepage,
        color: organization_color,
      };
      await handleCreateOrganization(organizationObject);
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

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" className="open-dialog-button" data-testid="createneworgbutton" sx={{ mt: 2, mb: 2 }}>
        {t("createneworg")}
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t("createneworg")}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              id="name"
              label={t("name")}
              value={organization_name}
              onChange={(e) => setOrganizationName(e.target.value)}
              fullWidth
              required
              error={!!errorFields.name}
              data-testid="organization-name"
              sx={{ mb: 2 }}
            />
            <TextField
              id="email"
              label={t("email")}
              className="organization-email"
              value={organization_email}
              onChange={(e) => setOrganizationEmail(e.target.value)}
              fullWidth
              required
              error={!!errorFields.email}
              data-testid="organization-email"
              sx={{ mb: 2 }}
            />
            <TextField
              id="homepage"
              label={t("homepage")}
              value={organization_homepage}
              onChange={(e) => setOrganizationHomePage(e.target.value)}
              fullWidth
              required
              error={!!errorFields.homepage}
              data-testid="organization-homepage"
              sx={{ mb: 2 }}
            />
            <TextField
              id="color"
              label={t("color")}
              value={organization_color}
              onChange={(e) => setOrganizationColor(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
          </Box>
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
        message={t("allmandfieldsrequired")}
      />
    </div>
  );
};

export default CreateOrganization;
