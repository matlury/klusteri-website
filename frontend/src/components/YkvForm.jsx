import React from "react";

const YkvForm = ({
  responsibility,
  setResponsibility,
  nameFilter,
  handleFilterChange,
  allUsersWithKeys,
  selectedForYKV,
  handleCheckboxChange,
  handleYkvLogin,
}) => {
  return (
    <form>
      <div>
        <label htmlFor="responsibility">Kenestä otat vastuun?</label>
        <input
          id="responsibility"
          type="responsibility"
          value={responsibility}
          onChange={(e) => setResponsibility(e.target.value)}
        />
      </div>
      <br />
      <p>Kirjaa sisään muita henkilöitä</p>
      Etsi avaimellisia henkilöitä käyttäjänimellä:{" "}
      <input value={nameFilter} onChange={handleFilterChange} type="text" />
      <br />
      <br />
      <div
        style={{
          maxHeight: "200px",
          overflow: "auto",
          border: "3px solid black",
          borderRadius: "10px",
          paddingLeft: "10px",
          width: "45vw",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {allUsersWithKeys
            .filter((user) =>
              user.username.toLowerCase().includes(nameFilter.toLowerCase()),
            )
            .map((user) => (
              <li key={user.id}>
                {user.username}, {user.email}
                <input
                  type="checkbox"
                  checked={selectedForYKV.includes(user)}
                  onChange={() => handleCheckboxChange(user)}
                />
              </li>
            ))}
        </ul>
      </div>
      <br />
      <button
        onClick={handleYkvLogin}
        className="create-user-button"
        type="button"
        data-testid="createresponsibility"
      >
        Ota vastuu
      </button>
    </form>
  );
};

export default YkvForm;
