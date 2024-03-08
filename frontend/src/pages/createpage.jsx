import React, { useState } from 'react'
import axios from 'axios'
import LoginPage from './loginpage'
import '../index.css'

const NewAccountPage = ({ onAccountCreated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [showLoginPage, setShowLoginPage] = useState(false)
  const [error, setError] = useState('')
  const [userCreated, setUserCreated] = useState(false)

  const API_URL = process.env.API_URL
  
  const handleCreateAccount = () => {
    /*
    Check that username, password, email
    and confirm password are not empty
    */
    if (!username || !password || !email || !confirmPassword) {
      setError('Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.')
      return
    }

    /*
    Check that the username are not space
    */
    if (!/^[a-zA-Z0-9.\-_$@*!]{1,20}$/.test(username)) {
      setError('Käyttäjänimen tulee olla enintään 20 merkkiä eikä saa sisältää välilyöntejä.')
      return
    }

    /*
    Check that the password and
    confirm password are the same
    */
    if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää.')
      return
    }

    /*
    Check that the email is valid
    */
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        setError("Viheellinen sähköposti osoite.")
        return
    }

    /*
    Check that the password is 
    8-20 characters long
    */
    if (password.length < 8 || password.length > 20) {
      setError('Salasanan tulee olla 8-20 merkkiä pitkä.')
      return
    }

    /*
    Check that the password is not
    only numbers
    */
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.')
      return
    }

    /*
    Check if telegram is provided and unique
    */
    if (telegram) {
      axios.get(`${API_URL}/users/?telegram=${telegram}`)
        .then(response => {
          const existingUsers = response.data
          if (existingUsers.some(user => user.telegram === telegram)) {
            setError('Telegram on jo käytössä.')
          } else {
            // Proceed with account creation
            createAccount()
          }
        })
        .catch(error => {
          console.error('Error checking telegram:', error)
          setError('Virhe tarkistettaessa telegramia.')
        })
    } else {
      // Proceed with account creation
      createAccount()
    }
  }

  const createAccount = () => {
    /*
    Send request to server to check if email is already in use
    */
      axios.get(`${API_URL}/users/?email=${email}`)
      .then(response => {
        const existingUsers = response.data
        if (existingUsers.some(user => user.email === email)) {
          setError('Sähköposti on jo käytössä.')
        } else {
          const userObject = { username, password, email, telegram, role: 5 }
          axios.post(`${API_URL}/users/`, userObject)
            .then(response => {
              console.log(response)
              console.log('Account created successfully!')
              setUserCreated(true)
              onAccountCreated && onAccountCreated()

              // Set timeout to hide success message after 5 seconds
              setTimeout(() => {
                setUserCreated(false);
              }, 5000);
            })
            .catch(error => {
              console.error('Error creating account:', error);
              setError('Virhe luotaessa käyttäjää.');
            });
          setShowLoginPage(true)
        }
      })
      .catch(error => {
        console.error('Error checking email:', error)
        setError('Virhe tarkistettaessa sähköpostia.')
      })
  }

  const handleBackToLogin = () => {
    setShowLoginPage(true)
  }

  const toggleShowPasswords = () => {
    setShowPasswords(prevState => !prevState)
  }

  const createForm = () => (
    <form className="form-container">
      <h2>Luo uusi käyttäjä</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-fields">
        <div>
          Käyttäjänimi:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Salasana:
          <input
            type={showPasswords ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          Vahvista salasana:
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={toggleShowPasswords}
          />
          Näytä salasana
        </div>
        <div>
          Sähköposti:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          Telegram (valinnainen):
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
      </div>
      <button className="login-button" type="button" onClick={handleBackToLogin}>
        Takaisin
      </button>
      <button className="create-user-button" type="button" onClick={handleCreateAccount}>
        Luo käyttäjä
      </button>
    </form>
  )

  return (
    <div id="right_content">{showLoginPage ? <LoginPage /> : createForm()}
      {userCreated && <p style={{ color: 'green' }}>Käyttäjä luotu onnistuneesti!</p>}
    </div>
  )
}

export default NewAccountPage
