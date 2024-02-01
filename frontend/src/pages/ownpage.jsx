import React, { useState } from 'react';
import axios from 'axios'
import '../index.css'

const ownPage = ({ user }) => {
    const user = user
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [telegram, setTelegram] = useState('')

    const handleEdit = () => {

    }

    const userPage = () => {
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
      <button type="edit-button" onClick={handleEdit}>Vahvista muutokset</button>
    </form>
    }


    return (
        <div id="left_content">
      </div>
      )
}
