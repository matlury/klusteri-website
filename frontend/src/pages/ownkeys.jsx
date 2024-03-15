import '../index.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import axiosClient from '../axios.js'

const API_URL = process.env.API_URL

const OwnKeys = ({ isLoggedIn: propIsLoggedIn }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)
    const [responsibility, setResbonsibility] = useState('')
    const [email, setEmail] = useState('')
    const [ownResponsibilities, setOwnResponsibilities] = useState([])

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        setIsLoggedIn(propIsLoggedIn)
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
        if (propIsLoggedIn) {
            setEmail(loggedUser.email)
            getResponsibility()
        }
      }, [propIsLoggedIn])

    const ykvForm = () => (
        <form>
            <div>
                Kenestä otat vastuun?
                <input
                    id="responsibility"
                    type="responsibility"
                    value={responsibility}
                    onChange={(e) => setResbonsibility(e.target.value)}
                />
            </div>
            <br />
            <button onClick={handleYkvLogin} className='create-user-button' type='button'>
                Ota vastuu
            </button>
        </form>
    )

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

        confirmYKV()

        function confirmYKV() {
            const confirm = window.confirm(`Otan vastuun henkilöistä: ${responsibility}\nAlkaen kello: ${loginTime}`)
            
            if (confirm) {
                axiosClient.post(`/ykv/create_responsibility`, responsibilityObject)
                .then(response => {
                    console.log(response.data)
                    console.log('Läpi meni')
                    setSuccess('YKV-sisäänkirjaus onnistui')
                    setTimeout(() => setSuccess(''), 5000)
                    getResponsibility()
                })
                .catch(error => {
                    setError("YKV-sisäänkirjaus epäonnistui")
                    setTimeout(() => setError(''), 5000)
                    console.error('Pyyntö ei menny läpi', error)
                })
            } else {
                console.log("YKV peruttu")
            }
        }
    }

    const handleYkvLogout = (id) => {
        const logoutTime = getCurrentDateTime()
        axiosClient.put(`ykv/update_responsibility/${id}/`, {logout_time: logoutTime})
            .then(response => {
                console.log('Ykv-uloskirjaus onnistui', response.data)
                setSuccess('YKV-uloskirjaus onnistui')
                setTimeout(() => setSuccess(''), 5000)
                getResponsibility()
            })
            .catch(error => {
                setError('YKV-uloskirjaus epäonnistui')
                setTimeout(() => setError(''), 5000)
                console.error('Ykv-uloskirjaus epäonnistui', error)
            })
        }

    function getCurrentDateTime() {
        let currentDate = new Date()
        let day = String(currentDate.getDate()).padStart(2, '0')
        let month = String(currentDate.getMonth() + 1).padStart(2, '0')
        let year = String(currentDate.getFullYear())
        let hours = String(currentDate.getHours()).padStart(2, '0')
        let minutes = String(currentDate.getMinutes()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}`
    }

    function checkIfLoggedIn() {
        if (ownResponsibilities.length === 0) {
            return false
        }
        return ownResponsibilities.some(resp => resp.present === true)
    }

    const getResponsibility = () => {
        axiosClient.get(`listobjects/nightresponsibilities/?email=${email}`)
            .then(response => {
                setOwnResponsibilities(response.data)
            })
            .catch(error => {
                console.error('Error fetching responsibilities', error)
            })
        
    }

    const responsibilityPage = () => (
        <div>
            <h2>Omat vastuut</h2>
            <ul style={{ listStyleType: 'none', padding:0}}>
                {ownResponsibilities.slice().reverse().map(resp => (
                    <li key={resp.id}> 
                        Vastuussa henkilöistä: {resp.responsible_for} <br />
                        YKV-sisäänkirjaus klo: {resp.login_time} <br />
                        YKV-uloskirjaus klo: {resp.logout_time}
                        {resp.present && 
                        <button onClick={() => handleYkvLogout(resp.id)} className='login-button' type='button'>
                        YKV-uloskirjaus
                        </button>
                        }
                    <br /><br />
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div id='left_content'>
            {!isLoggedIn && <p>Kirjaudu sisään muokataksesi tietoja</p>}
            {isLoggedIn && (
                <div id='leftleft_content'>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {checkIfLoggedIn() && <p>Tee YKV-uloskirjaus ottaaksesi uuden vastuun</p>}
                    {!checkIfLoggedIn() && ykvForm()}
                    {responsibilityPage()}
                </div>
            )}

        </div>
    )
}

export default OwnKeys