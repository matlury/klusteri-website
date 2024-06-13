import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";

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
}) => {
  // State variables to manage dialog visibility and field validation
  const [open, setOpen] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle organization creation and close dialog
  const handleCreateAndClose = () => {
    // Validate fields
    const errors = {};
    if (!organization_name) errors.name = true;
    if (!organization_email) errors.email = true;
    if (!organization_homepage) errors.homepage = true;

    if (Object.keys(errors).length === 0) {
      // All fields are filled, proceed with organization creation
      handleCreateOrganization();
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
      {/* Open button for the dialog */}
      <Button onClick={handleClickOpen} variant="contained" className="open-dialog-button">
        + Luo järjestö
      </Button>

      {/* Dialog for organization creation */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Luo uusi järjestö</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <form>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="name"
                label="Järjestön nimi"
                value={organization_name}
                onChange={(e) => setOrganizationName(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.name} // Show error if field is empty
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="email"
                label="Sähköposti"
                className="organization-email"
                value={organization_email}
                onChange={(e) => setOrganizationEmail(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.email} // Show error if field is empty
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="homepage"
                label="Kotisivu"
                value={organization_homepage}
                onChange={(e) => setOrganizationHomePage(e.target.value)}
                fullWidth
                required // Make required
                error={errorFields.homepage} // Show error if field is empty
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                id="color"
                label="Järjestön väri"
                value={organization_color}
                onChange={(e) => setOrganizationColor(e.target.value)}
                fullWidth
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Peruuta
          </Button>
          <Button onClick={handleCreateAndClose} variant="contained" className="create-organization-button" data-testid="create-organization-button">
            Luo järjestö
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for displaying error message */}
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
