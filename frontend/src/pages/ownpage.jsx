import React, { useState, useEffect } from 'react'
import axios from 'axios'
import axiosClient from '../axios.js'

const OwnPage = ({ isLoggedIn: propIsLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [role, setRole] = useState('5')
  const [organisations, setOrganisations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [orgPassword, setNewOrgPassword] = useState('')
  const [confirmOrgPassword, setConfirmOrgPassword] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [setCheckedOrgs] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)

  const API_URL = import.meta.env.API_URL || 'http://localhost:8000'

  // Writes down if a user is logged in
  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
    if (propIsLoggedIn) {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      setUsername(loggedUser.username);
      setEmail(loggedUser.email);
      setTelegram(loggedUser.telegram);
      setRole(loggedUser.role);
    }
  }, [propIsLoggedIn]);


  // Fetches the organisations if a user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      getOrganisations()
    }
  }, [isLoggedIn])


  const getOrganisations = () => {
    axios
      .get(`${API_URL}/organizations/`)
      .then(response => {
        const data = response.data
        setOrganisations(data)
      })
      .catch(error => {
        console.error('Error fetching organisations:', error)
      })
  }

  // Shows the information of a standard user
  const userPage = () => (
    <form>
      <div>
        Käyttäjänimi:
        <input
          id="username"
          type="username"
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
        Myöntämispäivä:
      </div>
      <br />
      <button onClick={handleUserDetails} className="create-user-button" type="button">
        Vahvista muutokset
      </button>
    </form>
  );

  // Shows the information of organizations after clicking the view-button
  const toggleDetails = (orgId) => {
    setSelectedOrg((prevSelectedOrg) => {
      if (prevSelectedOrg === orgId) {
        return null;
      }
      return orgId;
    });
  };
  
  // Handles the change if you click on the checkbox
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked)
  }

  // Handles the user info update when the 'Vahvista Muutokset' button is clicked
  const handleUserDetails = (event) => {
    event.preventDefault();
  
    const details = {
      username: username,
      email: email,
      telegram: telegram
    };
  
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const user_id = loggedUser.id;
  
    console.log(user_id);

    const confirmUpdate = window.confirm("Oletko varma, että haluat päivittää käyttäjätietojasi?")
    if (confirmUpdate) {
      axiosClient.put(`/users/update/${user_id}/`, details)
      .then(response => {
        console.log('User details updated successfully:', response.data);
        localStorage.setItem('loggedUser', JSON.stringify(response.data))
      })
      .catch(error => {
        console.error('Error updating user details:', error);
      })
    } else {
      console.log("User cancelled the update.")
    }
  }

  // Shows more detailed information of the organizations
  const renderOrganizationDetails = orgId => {
    const organization = organisations.find(org => org.id === orgId)
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
                onChange={(e) => setNewOrgPassword(e.target.value)} />
            </div>
            <div>
              Toista uusi salasana:
              <input
                id="confirmOrgPassword"
                type="confirmOrgPassword"
                value={confirmOrgPassword}
                onChange={(e) => setConfirmOrgPassword(e.target.value)} />
            </div>
          </form>
          <div>
            <label>
              <p style={{ display: 'inline-block', marginRight: '10px' }}>* Nimet saa julkaista</p>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange} />
            </label>
          </div>
        </div>
      )
    }
    return null
  }

  //  Organization list 
  
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
      {!isLoggedIn && <p>Kirjaudu sisään muokataksesi tietoja</p>}
      {isLoggedIn && (
        <div id="left_content">
          <div id="leftleft_content">
            {userPage()}
            {organisationPage()}
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnPage
