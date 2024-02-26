import '../index.css'
import React, { useState, useEffect } from 'react'

const OwnKeys = ({ isLoggedIn: propIsLoggedIn }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn)

    useEffect(() => {
        setIsLoggedIn(propIsLoggedIn)
      }, [propIsLoggedIn])

    return (
        <div id= 'left_content'>
            {!isLoggedIn && <p>Kirjaudu sisään muokataksesi tietoja</p>}
            {isLoggedIn && <h1>Sivua rakennetaan vielä! :)</h1>}
    </div>
    )
}

export default OwnKeys