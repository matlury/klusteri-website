import React from "react";
import { formatDatetime } from "../utils/timehelpers";

const Responsibilities = ({
    allResponsibilities,
    minFilter,
    handleMinFilterChange,
    maxFilter,
    handleMaxFilterChange,
    ykvFilter,
    handleYkvFilterChange,
  }) => {
  return (
    <div>
      <h2>Kaikki vastuut</h2>
      Etsi henkilöitä:{" "}
      <br />
      <input value={ykvFilter} onChange={handleYkvFilterChange} type="text" />
      Hae kirjauksia aikavälillä:{" "}
      <br />
      <input value={minFilter} onChange={handleMinFilterChange} type="datetime-local" />
      <input value={maxFilter} onChange={handleMaxFilterChange} type="datetime-local" />
      <br />
      <br />
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
            .filter((resp) =>
              (resp.username.toLowerCase().includes(ykvFilter.toLowerCase()) ||
              resp.created_by.toLowerCase().includes(ykvFilter.toLowerCase()) ||
              resp.responsible_for.toLowerCase().includes(ykvFilter.toLowerCase())) && 
              Date.parse(resp.login_time) < Number(Date.parse(maxFilter)) &&
              Date.parse(resp.logout_time) > Number(Date.parse(minFilter))
            )
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
                Vastuuhenkilö: {resp.username}, {resp.email}, {resp.organisations} <br />
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

export default Responsibilities;
