import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnPage = ({ isLoggedIn: propIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [role, setRole] = useState('5');
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgPassword, setNewOrgPassword] = useState('')
  const [confirmOrgPassword, setConfirmOrgPassword] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [checkedOrgs, setCheckedOrgs] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)

  // Writes down if a user is logged in
  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
  }, [propIsLoggedIn]);


  // Fetches the organisations if a user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      getOrganisations();
      }
  }, [isLoggedIn])


  const getOrganisations = () => {
    axios
      .get('http://localhost:8000/organizations/')
      .then(response => {
        const data = response.data;
        setOrganisations(data);
      })
      .catch(error => {
        console.error('Error fetching organisations:', error);
      });
  };

  // Shows the information of a standard user
  const userPage = () => (
    <form>
      <div>
        Käyttäjänimi:
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        Sähköposti:
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Telegram:
        <input
          id="telegram"
          type="telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>
      <div>
        Rooli: {role}
      </div>
      <div>
        Virka:
      </div>
      <div>
        Tyyppi:
      </div>
      <div>
        Myöntöpäivä:
      </div>
      <br />
      <button type="edit-button">Vahvista muutokset</button>
    </form>
  );

  // Shows the information of organizations after clicking the view-button
  const toggleDetails = orgId => {
    setCheckedOrgs(prevState => ({
      ...prevState,
      [orgId]: !prevState[orgId]
    }));

    setSelectedOrg(orgId === selectedOrg ? null : orgId);
  };

  // Handles the change if you click on the checkbox
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Shows more detailed information of the organizations
  const renderOrganizationDetails = orgId => {
    const organization = organisations.find(org => org.id === orgId);
    if (selectedOrg === orgId && organization) {
      return (
        <div>
          <p>Nimi: {organization.name}</p>
          <p>Käyttäjätunnus: </p>
          <p>Koko: {organization.size}</p>
          <p>Kotisivu: {organization.homepage}</p>
          <p>Puheenjohtaja:</p>
          <p>Puheenjohtajan sähköposti: {organization.email}</p>
          <p>Klusterivastaava(t): </p>
          <br></br>
          <form>
            <div>
              Uusi salasana:
                <input
                  id="orgPassword"
                  value={orgPassword}
                  onChange={(e) => setNewOrgPassword(e.target.value)}/>
            </div>
            <div>
              Uusi salasana uudelleen:
                <input
                  id="confirmOrgPassword"
                  type="confirmOrgPassword"
                  value={confirmOrgPassword}
                  onChange={(e) => setConfirmOrgPassword(e.target.value)}/>
            </div>
          </form>
          <div>
            <label>
            <p style={{ display: 'inline-block', marginRight: '10px' }}>* Nimet saa julkaista</p>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}/>
            </label>
          </div>
        </div>
      );
    }
    return null;
  };

  // Organizationpage
  const organisationPage = () => (
    <div>
      <h2>Järjestöt</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {organisations.map(org => (
          <li key={org.id}>
            {org.name}
            <button onClick={() => toggleDetails(org.id)}>View</button>
            {renderOrganizationDetails(org.id)}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
    {!isLoggedIn && <p>Kirjaudu ensin sisään</p>}
    {isLoggedIn && (
      <div id="left_content">
        <div id="leftleft_content">
          {userPage()}
          {organisationPage()}
        </div>
      </div>
    )}
  </div>
  );
};

export default OwnPage;
