import React from "react";
import { formatDatetime } from "../utils/timehelpers";

const OwnYkvList = ({ ownResponsibilities }) => {
  return (
    <div>
      <h2>Omat vastuut</h2>
      <div
        style={{
          maxHeight: "500px",
          overflow: "auto",
          border: "3px solid black",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {ownResponsibilities
            .slice()
            .reverse()
            .map((resp) => (
              <li
              className="ykv"
              key={resp.id}
              style={{
                backgroundColor: resp.present
                  ? "rgb(169, 245, 98)"
                  : "transparent",
              }}>
                Luonut: {resp.created_by} <br />
                Vastuussa henkilöistä: {resp.responsible_for} <br />
                YKV-sisäänkirjaus klo: {formatDatetime(resp.login_time)} <br />
                YKV-uloskirjaus klo:{" "}
                {!resp.present && formatDatetime(resp.logout_time)}
                <br />
                <br />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnYkvList;
