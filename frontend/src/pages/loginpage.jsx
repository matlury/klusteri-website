import React from 'react'
import '../index.css'

const LoginPage = () => {
    const loginForm = () => (
        <form>
          <div>
            käyttäjänimi:
            <input id="username" value="" />
         </div>
          <div>
            salasana:
            <input id="password" value="" />
          </div>
          <button onclick>login</button>
        </form>
      )

    return (
        <div id= 'content2'>
            <p>
            {loginForm()}
            </p>
        </div>
    )
}

export default LoginPage