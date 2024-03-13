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
                Kenestä otan vastuun
                <input
                    id="responsibility"
                    type="responsibility"
                    value={responsibility}
                    onChange={(e) => setResbonsibility(e.target.value)}
                />
            </div>
            <br />
            <button onClick={handleTakeResponsibility} className='create-user-button' type='button'>
                Ota vastuu
            </button>
        </form>
    )

    const handleTakeResponsibility = (event) => {
        event.preventDefault()
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
        const username = loggedUser.username
        const email = loggedUser.email
        
        const responsibilityObject = {
            username: username,
            email: email,
            responsible_for: responsibility,
            login_time: getCurrentDateTime()
        }

        axiosClient.post(`/ykv/create_responsibility`, responsibilityObject)
            .then(response => {
                console.log(response.data)
                console.log('Läpi meni')
            })
            .catch(error => {
                console.error('Pyyntö ei menny läpi', error)
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

    const getResponsibility = () => {
        axiosClient.get(`listobjects/nightresponsibilities/?email=${email}`)
            .then(response => {
                const data = response.data
                console.log(data)
                setOwnResponsibilities(data)
            })
            .catch(error => {
                console.error('Error fetching responsibilities', error)
            })
        
    }

    const responsibilityPage = () => (
        <div>
            <h2>Omat vastuut</h2>
            <ul style={{ listStyleType: 'none', padding:0}}>
                {ownResponsibilities.map(resp => (
                    <li key={resp.id}>
                        {resp.login_time}
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
                    {ykvForm()}
                    {responsibilityPage()}
                </div>
            )}

        </div>
    )
}

export default OwnKeys