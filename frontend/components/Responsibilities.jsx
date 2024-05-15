import React from "react";
import { formatDatetime } from "../src/utils/timehelpers";

const Responsibilities = ({ allResponsibilities }) => {
    return (
    <div>
      <h2>Kaikki vastuut</h2>
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
          {allResponsibilities
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
                }}
              >
                Vastuuhenkilö: {resp.username}, {resp.email} <br />
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

export default Responsibilities