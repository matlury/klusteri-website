import React, { useState, useEffect } from "react";
import "../index.css";

function Popup(props) {
  const [selectedResponsibilities, setSelectedResponsibilities] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    console.log(selectedResponsibilities);
  }, [selectedResponsibilities]);

  // handles the checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedResponsibilities((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((responsibilityId) => responsibilityId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  // handles the select-all button click (selects/unselects every active YKV-login)
  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedResponsibilities([]);
    } else {
      const allIds = props.active.map((resp) => resp.id);
      setSelectedResponsibilities(allIds);
    }
    setSelectAllChecked((prevState) => !prevState);
  };

  // returns the selected id:s for logout and closes the popup window
  const handleSubmit = () => {
    const confirm = window.confirm(
      "Oletko varma, että haluat kirjata ulos valitut henkilöt?",
    );
    if (confirm) {
      props.onSubmit(selectedResponsibilities);
      props.setTrigger(false);
    }
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <h2>Valitse uloskirjattavat</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {props.active
            .slice()
            .reverse()
            .map((resp) => (
              <li className="ykv2" key={resp.id}>
                <b>{resp.responsible_for}</b>
                <br />
                Vastuuhenkilö: {resp.user.username}, {resp.user.email}
                <input
                  type="checkbox"
                  checked={selectedResponsibilities.includes(resp.id)}
                  onChange={() => handleCheckboxChange(resp.id)}
                />
              </li>
            ))}
        </ul>
        <button className="grey-button" onClick={handleSelectAll}>
          Select All
        </button>
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          close
        </button>
        <button
          className="grey-button"
          onClick={handleSubmit}
          style={{ marginLeft: "10px" }}
        >
          Submit
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
