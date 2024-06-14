import React from "react";
import { Link } from "react-router-dom";

const Contacts = () => {
  const OpenChristinaRegina = () => {
    const christinaregina_url = "/christina_regina";
    window.open(christinaregina_url, "_self");
  };
  return (
    <div className="textbox">
      <h1>Domus Gaudium</h1>
      <p>
        Domus Gaudium sijaitsee osoitteessa Leppäsuonkatu 11A, 00100 Helsinki.
      </p>
      <Link to="/christina_regina">
        <h1>Christina Regina</h1>
       </Link>
      <p>
        Christina Regina sijaitsee Domus Gaudiumin ensimmäisessä kerroksessa.
      </p>
      <h1>Klusterikännykkä</h1>
      <p>Klusterille voi soittaa numeroon 044 9556085</p>
      <h1>Leppätalokomitea</h1>
      <p>Klusterin viihtyvyydestä ja säännöistä vastaa Leppätalokomitea.</p>
      Vuonna 2023 puheenjohtajana toimii Tomas Terälä (tomas.terala (at)
      helsinki.fi)
      <h1>Järjestöjen yhteyshenkilöt</h1>
    </div>
  );
};

export default Contacts;
