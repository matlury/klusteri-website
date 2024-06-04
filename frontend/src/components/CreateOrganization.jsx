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
  organization_size,
  setOrganizationSize,
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
          class="organization-email"
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
        <FormControlLabel control={<Switch />} label="Iso järjestö" />
        <TextField
          id="size"
          label="Koko"
          value={organization_size}
          onChange={(e) => setOrganizationSize(e.target.value)}
        />
      </div>
      <br />
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
