import React from "react";
import { Button, TextField, Switch, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <form>
      <h4>{t("createneworg")}</h4>
      <div>
        <TextField
          id="name"
          label={t("name")}
          value={organization_name}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="email"
          label={t("email")}
          className="organization-email"
          value={organization_email}
          onChange={(e) => setOrganizationEmail(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="homepage"
          label={t("homepage")}
          value={organization_homepage}
          onChange={(e) => setOrganizationHomePage(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="color"
          label={t("color")}
          value={organization_color}
          onChange={(e) => setOrganizationColor(e.target.value)}
        />
      </div>
      <Button
        onClick={handleCreateOrganization}
        variant="contained"
        className="create-user-button"
      >
        {t("createorg")}
      </Button>
    </form>
  );
};

export default CreateOrganization;
