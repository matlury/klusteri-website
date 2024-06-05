import React from "react";

/* Shows more detailed information of the 
  organizations and if the user has role 1, 
  they can also delete the organization.
  Also user can now update organization details
  if they have role 1, 2 or 3
  */

const OrganizationDetails = ({
  organisations,
  selectedOrg,
  orgId,
  hasPermissionOrg,
  organization_new_name,
  setOrganizationNewName,
  organization_new_homepage,
  setOrganizationNewHomePage,
  organization_new_email,
  setOrganizationNewEmail,
  organization_new_color,
  setOrganizationNewColor,
  handleOrganizationDetails,
  hasPermission,
  handleDeleteOrganization,
}) => {
  const organization = organisations.find((org) => org.id === orgId);

  if (selectedOrg === orgId && organization && hasPermissionOrg === true) {
    return (
      <div>
        Nimi:
        <input
          id="organization_name"
          type="organ"
          value={organization_new_name}
          onChange={(e) => setOrganizationNewName(e.target.value)}
        />
        <p>
          Kotisivu:
          <input
            id="organization_homepage"
            type="organ"
            value={organization_new_homepage}
            onChange={(e) => setOrganizationNewHomePage(e.target.value)}
          />
        </p>
        <p>Puheenjohtaja:</p>
        <p>
          Organisaation sähköposti:
          <input
            id="organization_new_email"
            type="organ"
            value={organization_new_email}
            onChange={(e) => setOrganizationNewEmail(e.target.value)}
          />
        </p>
        <p>Klusterivastaava(t): </p>
        <p>
          Organisaation väri:
          <input
            id="organization_new_color"
            type="organ"
            value={organization_new_color}
            onChange={(e) => setOrganizationNewColor(e.target.value)}
          />
        </p>
        {hasPermissionOrg === true && (
          <button
            onClick={() => handleOrganizationDetails(organization.id)}
            className="create-user-button"
            type="button"
          >
            Vahvista muutokset
          </button>
        )}
        {hasPermission === true && (
          <button
            onClick={() => handleDeleteOrganization(organization.id)}
            className="login-button"
            type="button"
          >
            Poista järjestö
          </button>
        )}
      </div>
    );
  }
  return null;
};

export default OrganizationDetails;
