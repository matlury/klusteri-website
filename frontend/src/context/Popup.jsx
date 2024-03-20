import React, { useState } from 'react'
import '../index.css'

function Popup(props) {
    console.log(props)
    const [idToLogout, setIdToLogout] = useState([])
    const [id, setId] = useState('')

    const handleCheckboxChange = (event) => {
        console.log("tapahtuma:", event)
        if (idToLogout.length === 0) {
            setIdToLogout(idToLogout.concat(event))
            console.log("lisättiin", idToLogout)
            return
        } else if (idToLogout.some(x => x === event)) {
            index = idToLogout.indexOf(event)
            setIdToLogout(idToLogout.splice(index, 1))
            console.log("poistettiin", idToLogout)
            return
        }
        setIdToLogout(idToLogout.concat(event))
        console.log("lisättiin 2", idToLogout)
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Kaikki vastuut</h2>
                <ul style={{ listStyleType: 'none', padding:0}}>
                    {props.active.slice().reverse().map(resp => (
                        <li className='ykv2' key={resp.id}>
                            Vastuuhenkilö: {resp.username}, {resp.email}    
                            <input
                            type="checkbox"
                            value={resp.id}
                            onChange={(event) => handleCheckboxChange(event.target.value)}
                        />
                        </li>
                    ))}
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>close</button>
                </ul>
            </div>
        </div>
    ) : ""
}

export default Popup