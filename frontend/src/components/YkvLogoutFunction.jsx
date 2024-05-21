import React from "react";
import { formatDatetime } from "../utils/timehelpers";
import EditPopup from "../context/EditPopup";
import Popup from "../context/Popup";

const YkvLogoutFunction = ({
  handleYkvLogout,
  idToLogout,
  buttonPopup,
  setButtonPopup,
  activeResponsibilites,
  setIdToLogout,
  loggedUser,
  setEditButtonPopup,
  editButtonPopup,
  setRespToEdit,
  handleYkvEdit,
}) => {
  return (
    <div>
      <button
        onClick={() => handleYkvLogout(idToLogout)}
        className="login-button"
        type="button"
      >
        {" "}
        YKV-uloskirjaus{" "}
      </button>
      {buttonPopup && (
        <Popup
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
          active={activeResponsibilites}
          setIdToLogout={setIdToLogout}
          onSubmit={handleYkvLogout}
        />
      )}
      <p></p>
      <h2>Kaikki aktiiviset ({Object.keys(activeResponsibilites).length}): </h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {activeResponsibilites
          .slice()
          .reverse()
          .map((resp) => (
            <li className="ykv-active" key={resp.id}>
              Vastuuhenkilö: {resp.username}, {resp.email}, {resp.organisations} <br />
              Luonut: {resp.created_by} <br />
              Vastuussa henkilöistä: {resp.responsible_for} <br />
              YKV-sisäänkirjaus klo: {formatDatetime(resp.login_time)} <br />
              <br></br>
              {(resp.username === loggedUser.username || resp.created_by === loggedUser.username) && (
                <>
                  <button
                    onClick={() => setEditButtonPopup(true)}
                    style={{ marginLeft: "20px" }}
                    className="login-button"
                    type="button"
                  >
                    {" "}
                    Muokkaa omaa YKV-kirjausta{" "}
                  </button>
                  {editButtonPopup && (
                    <EditPopup
                      trigger={editButtonPopup}
                      resp={resp}
                      setTrigger={setEditButtonPopup}
                      setRespToEdit={setRespToEdit}
                      onSubmit={handleYkvEdit}
                    />
                  )}
                </>
              )}
              <br />
              <br />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default YkvLogoutFunction;
