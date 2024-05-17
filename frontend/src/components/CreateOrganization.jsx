import React from "react";

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
        Järjestön nimi:
        <input
          type="text"
          id="name"
          value={organization_name}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </div>
      <div>
        Sähköposti:
        <input
          type="text"
          id="email"
          value={organization_email}
          onChange={(e) => setOrganizationEmail(e.target.value)}
        />
      </div>
      <div>
        Kotisivut:
        <input
          type="text"
          id="homepage"
          value={organization_homepage}
          onChange={(e) => setOrganizationHomePage(e.target.value)}
        />
      </div>
      <div>
        Koko:
        <input
          type="text"
          id="size"
          value={organization_size}
          onChange={(e) => setOrganizationSize(e.target.value)}
        />
      </div>
      <br />
      <button
        className="create-user-button"
        type="button"
        onClick={handleCreateOrganization}
      >
        Luo järjestö
      </button>
    </form>
  );
};

export default CreateOrganization;
