import '../index.css'
import React, { useState, useEffect } from 'react'
import axiosClient from '../axios.js'
import axios from 'axios'
import Popup from '../context/Popup.jsx'
import EditPopup from '../context/EditPopup.jsx'

const OwnKeys = ({ isLoggedIn: propIsLoggedIn, loggedUser: user }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)
    const [responsibility, setResponsibility] = useState('')
    const [email, setEmail] = useState('')
    const [loggedUser, setLoggedUser] = useState(user)
    const [allResponsibilities, setAllResponsibilities] = useState([])
    const [ownResponsibilities, setOwnResponsibilities] = useState([])
    const [activeResponsibilites, setActiveResponsibilites] = useState([])
    const [allUsersWithKeys, setAllUsersWithKeys] = useState([])

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [buttonPopup, setButtonPopup] = useState(false)
    const [idToLogout, setIdToLogout] = useState([])

    const [editButtonPopup, setEditButtonPopup] = useState(false)
    const [respToEdit, setRespToEdit] = useState('')

    const [selectedForYKV, setSelectedForYKV] = useState([])
    const [hasPermission, setHasPermission] = useState(false)

    const API_URL = process.env.API_URL

    // effect hooks keep the information of the logged user up to date
    useEffect(() => {
        setIsLoggedIn(propIsLoggedIn)
        if (propIsLoggedIn) {
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
            setEmail(loggedUser.email)
            setLoggedUser(loggedUser)
            getPermission()
        }
      }, [propIsLoggedIn])
    
    useEffect(() => {
        if (isLoggedIn) {
          getResponsibility()
          getActiveResponsibilities()
          getPermission()
        }
    }, [isLoggedIn, selectedForYKV])


    // Fetch all users with keys when the component mounts or when 'loggedUser' changes
    useEffect(() => {
        if (loggedUser) {
            getActiveResponsibilities()
            fetchAllUsersWithKeys()
        }
    }, [loggedUser])

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

    // fetch each user with keys if someone is logged in
    const fetchAllUsersWithKeys = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/listobjects/users/`)
            const allUsers = response.data
            const filteredUsers = allUsers.filter(user => checkUser(user))
            setAllUsersWithKeys(filteredUsers)
            console.log('avaimellliset', allUsersWithKeys)
        } catch (error) {
            console.error('Error fetching users with keys', error)
        }
    }
    

    // check if a user is valid for making an YKV-login
    const checkUser = (user) => {
        if (user.role === 5) {
            return false
        }
        if (user.id === loggedUser.id) {
            return false
        }
        // check if a user already has an active YKV
        const alreadyLoggedIn = allResponsibilities.filter(resp => resp.email === user.email && resp.present)
        if (alreadyLoggedIn.length !== 0){
            return false
        }
        return true
    }  

    // creates the current timestamp
    function getCurrentDateTime() {
        let currentDate = new Date()
        let day = String(currentDate.getDate()).padStart(2, '0')
        let month = String(currentDate.getMonth() + 1).padStart(2, '0')
        let year = String(currentDate.getFullYear())
        let hours = String(currentDate.getHours()).padStart(2, '0')
        let minutes = String(currentDate.getMinutes()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}`
    }

    function formatDatetime(datetimeString) {
        let date = new Date(datetimeString)
        
        let hours = String(date.getUTCHours()).padStart(2, '0')
        let minutes = String(date.getUTCMinutes()).padStart(2, '0')
        
        let day = String(date.getUTCDate()).padStart(2, '0')
        let month = String(date.getUTCMonth() + 1).padStart(2, '0')
        let year = String(date.getUTCFullYear())
        
        return `${hours}:${minutes} | ${day}.${month}.${year}`

    }
    // THE FOLLOWING FUNCTIONS HANDLES TAKING THE YKV-RESPONSIBILITIES

    // handles the checkbox change
    const handleCheckboxChange = (user) => {
        setSelectedForYKV(prevState => {
            if (prevState.includes(user)) {
                return prevState.filter(x => x !== user)
            } else {
                return [...prevState, user]
            }
        })
    }

    // the form that creates the responsibility by clicking the "Ota vastuu" button
    const ykvForm = () => (
        <form>
            <div>
                <label htmlFor='responsibility'>Kenestä otat vastuun?</label>
                <input
                    id='responsibility'
                    type='responsibility'
                    value={responsibility}
                    onChange={(e) => setResponsibility(e.target.value)}
                />
            </div>
            <br />
            Kirjaa sisään muita henkilöitä
            <br />
            <br />
            <div style={{ maxHeight: '75px', overflow: 'auto', border: '3px solid black', borderRadius: '10px', paddingLeft: '10px', width: '45vw'}}>
                <ul style={{ listStyleType: 'none', padding:0}}>
                    {allUsersWithKeys.map(user => (
                        <li key={user.id}>
                            {user.username}, {user.email}    
                            <input
                            type='checkbox'
                            checked={selectedForYKV.includes(user)}
                            onChange={() => handleCheckboxChange(user)}
                        />
                        </li>
                    ))}
                </ul>
            </div>
            <br />
            <button onClick={handleYkvLogin} className='create-user-button' type='button'>
                Ota vastuu
            </button>
        </form>
    )

    // this function handles the event of taking responsibility (check above)
    const handleYkvLogin = (event) => {
        event.preventDefault()
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
        const username = loggedUser.username
        const email = loggedUser.email
        const loginTime = getCurrentDateTime()
        
        const responsibilityObject = {
            username: username,
            email: email,
            responsible_for: responsibility,
            login_time: loginTime
        }

        confirmYKV(responsibilityObject)

        selectedForYKV.map(user => {
            const responsibilityObject = {
                username: user.username,
                email: user.email,
                responsible_for: responsibility + `, kirjauksen tekijä: ${loggedUser.username}`,
                login_time: loginTime
            }
            confirmYKV(responsibilityObject)
        })

        function confirmYKV(responsibilityObject) {
            const confirm = window.confirm(`Henkilö ${responsibilityObject.username}\nottaa vastuun henkilöistä: ${responsibility}\nAlkaen kello: ${loginTime}`)
            
            if (confirm) {
                axiosClient.post(`/ykv/create_responsibility`, responsibilityObject)
                .then(response => {
                    console.log('Läpi meni')
                    setSuccess('YKV-sisäänkirjaus onnistui')
                    setTimeout(() => setSuccess(''), 5000)
                    getResponsibility()
                    getActiveResponsibilities()
                })
                .catch(error => {
                    setError('YKV-sisäänkirjaus epäonnistui')
                    setTimeout(() => setError(''), 5000)
                    console.error('Pyyntö ei menny läpi', error)
                })
            } else {
                console.log('YKV peruttu')
            }
        }
        setSelectedForYKV([])
    }

    // function that checks if the user logged in (if there are no responsibilities, the user cant be logged in either)
    function checkIfLoggedIn() {
        if (allResponsibilities.length === 0) {
            return false
        }
        return ownResponsibilities.some(resp => resp.present === true)
    }


    // THE FOLLOWING FUNCTIONS RENDER SPECIFIC YKV-RESPONSIBILITIES 


    // fetches all of the responsibilities and the ones that the logged user has done
    const getResponsibility = () => {
        axiosClient.get(`listobjects/nightresponsibilities/`)
            .then(response => {
                setAllResponsibilities(response.data)
                const filteredResponsibilities = response.data.filter(item => item.email === email)
                setOwnResponsibilities(filteredResponsibilities)
            })
            .catch(error => {
                console.error('Error fetching responsibilities', error)
            })
        
    }

    const getActiveResponsibilities = () => (
        axiosClient.get(`listobjects/nightresponsibilities/`)
            .then(response => {
                setAllResponsibilities(response.data)
                const active = response.data.filter(item => item.present === true)
                setActiveResponsibilites(active)
            })
            .catch(error => {
                console.error('Error fetching responsibilities', error)
            })
        
    )

    // all of the responsibilities (only visible to leppis PJ)
    const responsibilities = () => (
        <div>
            <h2>Kaikki vastuut</h2>
            <div style={{ maxHeight: '500px', overflow: 'auto', border: '3px solid black', borderRadius: '10px', padding: '10px' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {allResponsibilities.slice().reverse().map(resp => (
                        <li
                            className='ykv'
                            key={resp.id}
                            style={{ backgroundColor: resp.present ? 'rgb(169, 245, 98)' : 'transparent' }}
                        >
                            Vastuuhenkilö: {resp.username}, {resp.email} <br />
                            Vastuussa henkilöistä: {resp.responsible_for} <br />
                            YKV-sisäänkirjaus klo: {formatDatetime(resp.login_time)} <br />
                            YKV-uloskirjaus klo: {!resp.present && formatDatetime(resp.logout_time)}
                            <br /><br />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
    

    // shows all of the responsibilites taken by the current user
    const ownYkvList = () => (
        <div>
            <h2>Omat vastuut</h2>
            <div style={{ maxHeight: '500px', overflow: 'auto', border: '3px solid black', borderRadius: '10px', padding: '10px' }}>
                <ul style={{ listStyleType: 'none', padding:0}}>
                    {ownResponsibilities.slice().reverse().map(resp => (
                        <li className='ykv' key={resp.id}> 
                            Vastuussa henkilöistä: {resp.responsible_for} <br />
                            YKV-sisäänkirjaus klo: {formatDatetime(resp.login_time)} <br />
                            YKV-uloskirjaus klo: {!resp.present && formatDatetime(resp.logout_time)}
                        <br /><br />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )


    // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGOUT

    // handles the end of taking responsibility
    const handleYkvLogout = (selectedIds) => {
        setButtonPopup(true)

        selectedIds.forEach(id => 
            axiosClient.put(`ykv/logout_responsibility/${id}/`, {logout_time: getCurrentDateTime()})
            .then(response => {
                setSuccess('YKV-uloskirjaus onnistui')
                setTimeout(() => setSuccess(''), 5000)
                getResponsibility()
                ownYkvList()
                getActiveResponsibilities()
                fetchAllUsersWithKeys()
            })
            .catch(error => {
                setError('YKV-uloskirjaus epäonnistui')
                setTimeout(() => setError(''), 5000)
                console.error('Ykv-uloskirjaus epäonnistui', error)
            })
        )
    }

    const logout_function = () => (
        <div>
            <button onClick={() => handleYkvLogout(idToLogout)} className='login-button' type='button'> YKV-uloskirjaus </button>
            {buttonPopup && (
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup} active={activeResponsibilites} setIdToLogout={setIdToLogout} onSubmit={handleYkvLogout}/>
            )}
            <p></p>
            <h2>Kaikki aktiiviset: </h2>
            <ul style={{ listStyleType: 'none', padding:0}}>
                {activeResponsibilites.slice().reverse().map(resp => (
                    <li className='ykv-active' key={resp.id}>
                        Vastuuhenkilö: {resp.username}, {resp.email} <br />
                        Vastuussa henkilöistä: {resp.responsible_for} <br />
                        YKV-sisäänkirjaus klo: {formatDatetime(resp.login_time)} <br />
                        <br></br>
                        {resp.username === loggedUser.username && (
                <>
                    <button onClick={() => setEditButtonPopup(true)} style={{ marginLeft: '20px' }} className='login-button' type='button'> Muokkaa omaa YKV-kirjausta </button>
                    {editButtonPopup && (
                        <EditPopup trigger={editButtonPopup} resp={resp} setTrigger={setEditButtonPopup} setRespToEdit={setRespToEdit} onSubmit={handleYkvEdit} />
                    )}
                </>
            )}
            <br /><br />
                    </li>
                ))}
            </ul>
        </div>
    )

    // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGIN EDITS

    const handleYkvEdit = (respId, respToEdit) => {
        console.log('resptoedit', respToEdit)

        axiosClient.put(`ykv/update_responsibility/${respId}/`, respToEdit)
            .then(response => {
                setSuccess('YKV-muokkaus onnistui')
                setTimeout(() => setSuccess(''), 5000)
                getResponsibility()
                ownYkvList()
                getActiveResponsibilities()
            })
            .catch(error => {
                setError('YKV-muokkaus epäonnistui')
                setTimeout(() => setError(''), 5000)
                console.error('Ykv-muokkaus epäonnistui', error)
            })
    }

    return (
        <div id='left_content'>
            {!isLoggedIn && <h3>Kirjaudu sisään</h3>}
            {isLoggedIn && (
                <div id='leftleft_content'>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {checkIfLoggedIn() && logout_function()}
                    {!checkIfLoggedIn() && user.role !== 5 && ykvForm()}
                    {!(loggedUser.role === 1 || loggedUser.role === 5) && ownYkvList()}
                    {hasPermission === true && responsibilities()}
                </div>
            )}

        </div>
    )
}

export default OwnKeys
