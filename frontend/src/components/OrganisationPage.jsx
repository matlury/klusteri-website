import React from "react";
import OrganizationDetails from "./OrganizationDetails";

const OrganisationPage = ({
  organisations,
  selectedOrg,
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
  toggleOrgDetails,
}) => {
  return (
    <div>
      <p></p>
      <h2>Järjestöt</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {organisations.map((org) => (
          <li key={org.id}>
            {org.name}
            {" (avaimia: "}
            {org.user_set.length}
            {")"}
            <button
              className="login-button"
              data-testid="orgdetailsbutton"
              onClick={() => toggleOrgDetails(org.id)}
            >
              View
            </button>
            {
              <OrganizationDetails
                organisations={organisations}
                selectedOrg={selectedOrg}
                orgId={org.id}
                hasPermissionOrg={hasPermissionOrg}
                organization_new_name={organization_new_name}
                setOrganizationNewName={setOrganizationNewName}
                organization_new_homepage={organization_new_homepage}
                setOrganizationNewHomePage={setOrganizationNewHomePage}
                organization_new_email={organization_new_email}
                setOrganizationNewEmail={setOrganizationNewEmail}
                organization_new_color={organization_new_color}
                setOrganizationNewColor={setOrganizationNewColor}
                handleOrganizationDetails={handleOrganizationDetails}
                hasPermission={hasPermission}
                handleDeleteOrganization={handleDeleteOrganization}
              />
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganisationPage;
