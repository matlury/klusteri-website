import React, { useState, useEffect } from 'react'
import '../index.css'

function EditPopup(props) {
    const [responsibleFor, setResponsibleFor] = useState(props.resp.responsible_for)
    const [responsibility, setResponsibility] = useState(props.resp)

    useEffect(() => {
        console.log('responsibilityfor popup', responsibleFor)
        console.log('responsibility popup', responsibility)
    }, [responsibleFor])

    // returns the selected id:s for logout and closes the popup window
    const handleSubmit = () => {
        const confirm = window.confirm('Oletko varma, että haluat tallentaa YKV-kirjauksen tiedot?')
        if (confirm) {
            const responsibilityObject = {
                username: responsibility.username,
                email: responsibility.email,
                responsible_for: responsibleFor,
                login_time: responsibility.login_time
            }
            props.onSubmit(responsibility.id, responsibilityObject)
            props.setTrigger(false)
        }
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Kenestä otat vastuun?</h2>
                <input
                    id= {props.resp.id}
                    type="responsibility"
                    value={responsibleFor}
                    onChange={(e) => setResponsibleFor(e.target.value)}
                /> 
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>close</button>
                    <button className="grey-button" onClick={handleSubmit} style={{ marginLeft: '10px' }}>Vahvista muutokset</button>
            </div>
        </div>
    ) : ""
}

export default EditPopup