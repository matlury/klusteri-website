import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context/ContextProvider'
import axios from 'axios'
import axiosClient from '../axios.js'
import '../index.css'
import { FaKey } from 'react-icons/fa'

const OwnPage = ({ isLoggedIn: propIsLoggedIn }) => {
  const { user, setUser } = useStateContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [role, setRole] = useState('5')

  const [organisations, setOrganisations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [orgPassword, setNewOrgPassword] = useState('')
  const [confirmOrgPassword, setConfirmOrgPassword] = useState('')
  const [isChecked, setIsChecked] = useState(false)

  const [organization_email, setOrganizationEmail] = useState('')
  const [organization_name, setOrganizationName] = useState('')
  const [organization_homepage, setOrganizationHomePage] = useState('')
  const [organization_size, setOrganizationSize] = useState('1')

  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedOrganization, setSelectedOrganization] = useState(null)

  const [hasPermission, setHasPermission] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_URL = process.env.API_URL
  // Writes down if a user is logged in
  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn)
    if (propIsLoggedIn) {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
      setUsername(loggedUser.username)
      setEmail(loggedUser.email)
      setTelegram(loggedUser.telegram)
      setRole(loggedUser.role)
      getOrganisations()
      getPermission()
    }
  }, [user || propIsLoggedIn])


  // Fetches the organisations if a user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      getOrganisations()
      getAllUsers()
      getPermission()
    }
  }, [isLoggedIn])

  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE LOGGED IN USER

  // Shows the information of a standard user
  const userPage = () => (
    <form>
      <div>
        Käyttäjänimi:
        <input
          id='username'
          type='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        Sähköposti:
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Telegram:
        <input
          id='telegram'
          type='telegram'
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>
      <br />
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
      <button onClick={handleUserDetails} className='create-user-button' type='button'>
        Vahvista muutokset
      </button>
    </form>
  )

  // Handles the user info update when the 'Vahvista Muutokset' button is clicked and gives error messages if the new username, email or telegram are taken by some other user
  const handleUserDetails = (event) => {
    event.preventDefault()
  
    const details = {
      username: username,
      email: email,
      telegram: telegram
    }
  
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    const user_id = loggedUser.id

    if (!username || !email ) {
      setError('Käyttäjänimi ja sähköposti ovat pakollisia kenttiä.')
      setTimeout(() => setError(''), 5000)
      return
    }

    if (telegram) {
      axios.get(`${API_URL}/api/listobjects/users/?telegram=${telegram}`)
        .then(response => {
          const existingUsers = response.data
          if (existingUsers.some(user => user.telegram === telegram && user.id !== loggedUser.id)) {
              setError('Telegram on jo käytössä.')
              setTimeout(() => setError(''), 5000)
              return
          }})}

    axios.get(`${API_URL}/api/listobjects/users/?email=${email}`)
      .then(response => {
        const existingUsers = response.data
          if (existingUsers.some(user => user.email === email && user.id !== loggedUser.id)) {
              setError('Sähköposti on jo käytössä.')
              setTimeout(() => setError(''), 5000)
              return
          }
          confirmupdate()
    })

    function confirmupdate() {
      const confirmUpdate = window.confirm('Oletko varma, että haluat päivittää käyttäjätietojasi?')

      if (confirmUpdate) {
        axiosClient.put(`/users/update/${user_id}/`, details)
          .then(response => {
            console.log('User details updated successfully:', response.data)
            localStorage.setItem('loggedUser', JSON.stringify(response.data))
            setUser(response.data)
            setSuccess('Tiedot päivitetty onnistuneesti!')
            setTimeout(() => setSuccess(''), 5000)
      })
      .catch(error => {
          console.error('Error updating user details:', error)
        })
      } else {
        console.log('User cancelled the update.')}
    }
  }


// HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE ORGANIZATIONS

  // Keeps the organization information up-to-date
  const getOrganisations = () => {
    axios
      .get(`${API_URL}/api/listobjects/organizations/`)
      .then(response => {
        const data = response.data
        setOrganisations(data)
      })
      .catch(error => {
        console.error('Error fetching organisations:', error)
      })
  }

  // Shows the information of organizations after clicking the view-button
  const toggleOrgDetails = (orgId) => {
    setSelectedOrg((prevSelectedOrg) => {
      if (prevSelectedOrg === orgId) {
        return null
      }
      return orgId
    })
  }
    
  // Handles the change if you click on the checkbox
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked)
  }

  // Shows more detailed information of the organizations and if the user has role 1, they can also delete the organization
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
                id='orgPassword'
                value={orgPassword}
                type='password'
                onChange={(e) => setNewOrgPassword(e.target.value)} />
            </div>
            <div>
              Toista uusi salasana:
              <input
                id='confirmOrgPassword'
                type='password'
                value={confirmOrgPassword}
                onChange={(e) => setConfirmOrgPassword(e.target.value)} />
            </div>
          </form>
          <div>
            <label>
              <p style={{ display: 'inline-block', marginRight: '10px' }}>* Nimet saa julkaista</p>
              <input
                type='checkbox'
                checked={isChecked}
                onChange={handleCheckboxChange} />
            </label>
          </div>
          <br />
          {hasPermission === true && <button onClick={() => handleDeleteOrganization(organization.id)} className='login-button' type='button'>
            Poista järjestö
          </button>}
        </div>
      )
    }
    return null
  }

  // Handles deletion of organization
  const handleDeleteOrganization = (orgId) => {
    axiosClient.delete(`/organizations/remove/${orgId}/`)
        .then(response => {
          console.log('Organization deleted successfully:', response.data)
          getOrganisations()
          setSuccess('Järjestö poistettu onnistuneesti!')
            setTimeout(() => setSuccess(''), 5000)
        })
        .catch(error => {
          console.error('Error deleting organization:', error)
        })
  }

  //  Organization list 
  const organisationPage = () => (
    <div>
      <p></p>
      <h2>Järjestöt</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {organisations.map(org => (
          <li key={org.id}>
            {org.name}  
            <button className= 'login-button' onClick={() => toggleOrgDetails(org.id)}>View</button>
            {renderOrganizationDetails(org.id)}
          </li>
        ))}
      </ul>
    </div>
  )

  // Form for organization creation
  const createOrganization = () => (
    <form>
      <h4>Luo uusi järjestö</h4>
        <div>
          Järjestön nimi:
          <input
            type='text'
            id='name'
            value={organization_name}
            onChange={(e) => setOrganizationName(e.target.value)}/>
        </div>
        <div>
          Sähköposti:
          <input
            type='text'
            id= 'email'
            value={organization_email}
            onChange={(e) => setOrganizationEmail(e.target.value)}/>
        </div>
        <div>
          Kotisivut:
          <input
          type='text'
          id= 'homepage'
          value={organization_homepage}
          onChange={(e) => setOrganizationHomePage(e.target.value)} />
        </div>
        <div>
          Koko:
          <input
          type= 'text'
          id= 'size'
          value={organization_size}
          onChange={(e) => setOrganizationSize(e.target.value)}/>
        </div>
        <br />
      <button className='create-user-button' type='button' onClick={handleCreateOrganization}>
        Luo järjestö
      </button>
    </form>
  )

  // Handles the creation of organizations
  const handleCreateOrganization = () => (
    axios.get(`${API_URL}/api/listobjects/organizations/?email=${organization_email}`)
      .then(response => {
        const existingOrganizations = response.data
        if (existingOrganizations.some(org => org.name === organization_name)) {
          setError('Nimi on jo käytössä')
          setTimeout(() => setError(''), 5000)
        }
        if (existingOrganizations.some(org => org.email === organization_email)) {
          setError('Sähköposti on jo käytössä.')
          setTimeout(() => setError(''), 5000)
        }
        else {
          const organizationObject = { name: organization_name, email: organization_email, homepage: organization_homepage, size: organization_size }
          console.log(organizationObject)
          axios.post(`${API_URL}/api/listobjects/organizations/`, organizationObject)
            .then(response => {
              console.log(response)
              console.log('Organization created successfully!')
              setSuccess('Järjestö luotu onnistuneesti!')
              setTimeout(() => setSuccess(''), 5000)
              getOrganisations()

            })
            .catch(error => {
              console.error('Error creating account:', error)
            })
        }
      })
      .catch(error => {
        console.error('Error checking email:', error)
      })
  )


// HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION FOR ALL USERS (ONLY VISIBLE FOR LEPPIS PJ)

  const showAllUsers = () => (
    <div>
        <p></p>
      <h4>Käyttäjät</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {allUsers.map(user => (
        <li key={user.id}>
          {user.username}
          <button className= 'login-button' onClick={() => toggleUserDetails(user.id)}>View</button>
          {renderUserDetails(user.id)}
        </li>
          ))}
      </ul>
    </div>
  )

  const getAllUsers = () => {
    axios
      .get(`${API_URL}/api/listobjects/users/`)
      .then(response => {
        const data = response.data
        setAllUsers(data)
      })
      .catch(error => {
        console.error('Error fetching all users:', error)
      })
  }

  const toggleUserDetails = (userId) => {
    setSelectedUser((prevSelectedUser) => {
      if (prevSelectedUser === userId) {
        return null
      }
      return userId
    })
  }

  const renderUserDetails = userId => {
    const user = allUsers.find(user => user.id === userId)
    if (selectedUser === userId && user) {
      return (
        <div>
          <p>Käyttäjänimi: {user.username}</p>
          <p>Telegram: {user.telegram}</p>
          <p>Rooli: {user.role}</p>
          <p>Sähköposti: {user.email}</p>
          <br></br>
          {hasPermission === true && <button onClick={() => handlePJChange(user.id)} className='change-pj-button' type='button'>
            Siirrä PJ-oikeudet
          </button>}
          <p></p>
        </div>
      )
    }
    return null
  }

  const handlePJChange = (userId) => {
    const selectedUserId = userId
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    const loggedUserId = loggedUser.id

    confirmupdate()

    function confirmupdate() {
      const confirmUpdate = window.confirm('Oletko varma, että haluat siirtää PJ-oikeudet?')

      if (confirmUpdate) {
        axiosClient.put(`/users/update/${selectedUserId}/`, {role: 1})
          .then(response => {
            console.log('Role updated successfully:', response.data)
      })
        axiosClient.put(`/users/update/${loggedUserId}/`, {role: 5})
          .then(response => {
            console.log('Role updated successfully', response.data)
            localStorage.setItem('loggedUser', JSON.stringify(response.data))
            setUser(response.data)
            setSuccess('Tiedot päivitetty onnistuneesti!')
            setTimeout(() => setSuccess(''), 5000)
        })
      .catch(error => {
          console.error('Error updating user details:', error)
        })
      } else {
        console.log('User cancelled the update.')}
    }
  }

  const handleKeySubmit = async (event) => {
    event.preventDefault()
  
    if (!selectedUser || !selectedOrganization) {
      console.error('Please select a user and an organization')
      return
    }
  
    // Display a confirmation dialog before handing over the key
    const confirmKeyHandover = window.confirm('Oletko varma että haluat luovuttaa avaimen?')
  
    if (!confirmKeyHandover) {
      return
    }
  
    try {
      const response = await axios.put(`/api/keys/hand_over_key/${selectedUser.id}/`, {
        organization_name: selectedOrganization
      })
  
      // Check the response and update the UI accordingly
      if (response.status === 200) {
        // Successful key handover
        setSuccess('Avaimen luovutus onnistui!')
      } else {
        // Error in key handover
        setError('ERROR')
      }
    } catch (error) {
      console.error('Error in key handover:', error)
      setError('Avaimen luovutus epäonnistui!')
    }
  }

  const handleSelectUser = (event) => {
    setSelectedUser(event.target.value)
  }

  const handleSelectOrganization = (event) => {
    setSelectedOrganization(event.target.value)
  }

  const getPermission = async () => {
    /*
    Check if the logged user has permissions for something
    This prevents harm caused by localstorage manipulation
    */

    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    await axios.get(`${API_URL}/api/users/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      const currentUser = response.data
      if (currentUser.role === 1) {
        setHasPermission(true)
      } else {
        setHasPermission(false)
      }
    })
  }
  
  return (
    <div>
      {!isLoggedIn && <h3>Kirjaudu sisään</h3>}
      {isLoggedIn && (
        <div>
          {error && <p style={{ color: 'red' }}>Virhe: {error}</p>}
          {success && <p style={{ color: 'green' }}>Onnistui: {success}</p>}
          <div style={{ display: 'flex' }}>
            <div id='left_content'>
              <div id='leftleft_content'>
                {userPage()}
                {organisationPage()}
                {hasPermission === true && createOrganization()}
                {hasPermission === true && showAllUsers()}
              </div>
            </div>
            {(hasPermission === true )&& (
              <div id='centered_content' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div id='content'>
                  <h2>Avaimen luovutus</h2>
                  <form onSubmit={handleKeySubmit}>
                    <div style={{ height: '20px' }}></div>
                    <div>
                      <label htmlFor='selectedUser'>Valitse vastaanottaja:</label>
                      <select
                        id='selectedUser'
                        name='selectedUser'
                        value={selectedUser}
                        onChange={handleSelectUser}
                        className='select-box'
                      >
                        {allUsers.map(user => (
                          <option key={user.id} value={user.email}>
                            {user.username} : {user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ height: '20px' }}></div>
                    <div>
                      <label htmlFor='selectedOrganization'>Valitse organisaatio:</label>
                      <select
                        id='selectedOrganization'
                        name='selectedOrganization'
                        value={selectedOrganization}
                        onChange={handleSelectOrganization}
                        className='select-box'
                      >
                        <option value="HYK">HYK</option>
                        <option value="Limes">Limes</option>
                        <option value="MaO">MaO</option>
                        <option value="Matrix">Matrix</option>
                        <option value="Meridiaani">Meridiaani</option>
                        <option value="Mesta">Mesta</option>
                        <option value="Moodi">Moodi</option>
                        <option value="Resonanssi">Resonanssi</option>
                        <option value="Spektrum">Spektrum</option>
                        <option value="Synop">Synop</option>
                        <option value="TKO-äly">TKO-äly</option>
                        <option value="Vasara">Vasara</option>
                        <option value="Integralis">Integralis</option>
                      </select>
                    </div>
                    <div style={{ height: '20px' }}></div>
                    <div>
                      Vastaanottaja: {selectedUser}
                      <p></p>
                      Organisaatio: {selectedOrganization}
                    </div>
                    <div style={{ height: '20px' }}></div>
                    <button type='submit' className='create-user-button'>
                      Luovuta <FaKey style={{ marginLeft: '5px' }} />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnPage
