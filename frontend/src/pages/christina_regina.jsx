import "../index.css";
import React from "react";
import christinaregina from "../ChristinaRegina.png";

const ChristinaRegina = () => {
  return (
    <div className="textbox">
      <h1>Christina Regina</h1>
      <p>
        Christina Regina eli Matlun klusteri sijaitsee Domus Gaudiumin
        ensimmäisessä kerroksessa (tila 1.8). Siinä on kolme tilaa: kokoushuone,
        kerhotila ja oleskelutila. Naapurissa on Conduksen klusteri eli Gustavus
        Rex.
      </p>
      <p>
        "Talon latinankielinen nimi, Domus Gaudium, tarkoittaa Ilo- tai
        Riemu-nimistä taloa. Se viittaa luontevasti opiskelun ja
        opiskelijaelämän riemuihin – ja jatkaa akateemista traditiota ja sopii
        paikan muuhun nimistöön, kuten Domus Academicaan. Talo sai myös oman
        tunnuslauseen, ”sub hoc tecto cives academici excoluntur”, joka
        suomennettuna tarkoittaa ”tämän rakennuksen suojissa tehdään akateemisia
        kansalaisia”. Lauseeseen sisältyy vahvasti henkisten ominaisuuksien
        kehittämisen merkitys."
      </p>
      <p>
        "HYYn puolella opiskelijoiden ja järjestöjen käyttöön tarkoitetut tilat
        on nimetty peilaten ylioppilaskunnan historiaa tuoreesti, mutta
        perinteitä kunnioittaen. Tärkeitä teemoja ovat olleet akateemisuus ja
        akateemisuuden merkittävimmät symbolit ja rikkaana elävä kaksikielisyys,
        sekä ylioppilaskunnan oman historian lisäksi myös Helsingin yliopiston
        ja kaupungin historia. Vaikutteita on myös Ruotsin ja Venäjän
        historiasta. Domus Academican puolella Domus Gaudiumiin liittyvässä
        kehityshankkeessa tilojen nimiin on käytetty kalevalaisia aiheita, kuten
        Aino ja Väinämöinen.
      </p>
      <img src={christinaregina} id="map" width="400" height="300" alt="Logo" />
    </div>
  );
};

export default ChristinaRegina;
