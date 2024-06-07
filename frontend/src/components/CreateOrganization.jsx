import React from "react";
import { Button, TextField, Switch, FormControlLabel } from "@mui/material";

// Form for organization creation
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
  return (
    <form>
      <h4>Luo uusi järjestö</h4>
      <div>
        <TextField
          id="name"
          label="Järjestön nimi"
          value={organization_name}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="email"
          label="Sähköposti"
          className="organization-email"
          value={organization_email}
          onChange={(e) => setOrganizationEmail(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="homepage"
          label="Kotisivu"
          value={organization_homepage}
          onChange={(e) => setOrganizationHomePage(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="color"
          label="Järjestön väri"
          value={organization_color}
          onChange={(e) => setOrganizationColor(e.target.value)}
        />
      </div>
      <Button
        onClick={handleCreateOrganization}
        variant="contained"
        className="create-user-button"
      >
        Luo järjestö
      </Button>
    </form>
  );
};

export default CreateOrganization;
