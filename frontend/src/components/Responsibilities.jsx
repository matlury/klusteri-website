import React from "react";
import { formatDatetime } from "../utils/timehelpers";
import { activeColour } from "../utils/ykvhelpers";

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
      Etsi henkilöitä: <br />
      <input value={ykvFilter} onChange={handleYkvFilterChange} type="text" data-testid="ykvfiltersearch"/>
      Hae kirjauksia aikavälillä: <br />
      <input type="hidden" id="timezone" name="timezone" value="03:00" />
      <input
        value={minFilter}
        onChange={handleMinFilterChange}
        type="datetime-local"
        data-testid="timefiltermin"
      />
      <input
        value={maxFilter}
        onChange={handleMaxFilterChange}
        type="datetime-local"
        data-testid="timefiltermax"
      />
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
            .filter(
              (resp) =>
                (resp.username
                  .toLowerCase()
                  .includes(ykvFilter.toLowerCase()) ||
                  resp.created_by
                    .toLowerCase()
                    .includes(ykvFilter.toLowerCase()) ||
                  resp.organisations
                    .toLowerCase()
                    .includes(ykvFilter.toLowerCase()) ||
                  resp.responsible_for
                    .toLowerCase()
                    .includes(ykvFilter.toLowerCase())) &&
                Date.parse(resp.login_time) <
                  Number(Date.parse(maxFilter)) -
                    new Date().getTimezoneOffset() * 60000 &&
                Date.parse(resp.logout_time) >
                  Number(Date.parse(minFilter)) -
                    new Date().getTimezoneOffset() * 60000,
            )
            .reverse()
            .map((resp) => (
              <li
                className="ykv"
                key={resp.id}
                style={{ backgroundColor: activeColour(resp) }}
              >
                Vastuuhenkilö: {resp.username}, {resp.email},{" "}
                {resp.organisations} <br />
                Luonut: {resp.created_by} <br />
                <p>Vastuussa henkilöistä: {resp.responsible_for}</p>
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
