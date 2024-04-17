import React, { useState } from 'react';

const Rules_and_Instructions = () => {
    const [showRules, setShowRules] = useState(false);

    const handleClick = () => {
        setShowRules(true);
    };

    const handleClose = () => {
        setShowRules(false);
    };

    return (
        <div className='textbox'>
            <h1>Säännöt ja ohjeet </h1>
            {showRules ? (
                <button onClick={handleClose}>Sulje säännöt</button>
            ) : (
                <button onClick={handleClick}>Näytä käyttösäännöt</button>
            )}
            {showRules && (
                <div className='rules'>
                    <h2>Matlu-klusterin käyttösäännöt</h2>
                    <div className="rule-section">
                        <h3>1§ Määräysala</h3>
                        <p>
                            Nämä säännöt koskevat Domus Gaudiumin klusteritila Christina Reginan
                            (myöhemmin klusteri) käyttöä. Ne täydentävät Helsingin yliopiston
                            ylioppilaskunnan (myöhemmin HYY) asettamia käyttösääntöjä.
                            Leppätalokomitea voi antaa tarkempia määräyksiä käyttösääntöjen
                            soveltamisesta.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>2§ Klusterin järjestöt</h3>
                        <p>
                            Klusteria saavat käyttää järjestöt, joilla on HYYn kanssa voimassa
                            oleva klusterin tilankäyttösopimus (myöhemmin järjestöt). Klusterin
                            käyttöä koordinoi Helsingin yliopiston matemaattis-
                            luonnontieteellisten opiskelijajärjestöjen yhteistyöjärjestö Matlu ry
                            (myöhemmin Matlu).
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>3§ Sääntöjen muuttaminen</h3>
                        <p>
                            Näitä käyttösääntöjä voidaan muuttaa 3/4 enemmistöllä
                            klusterikokouksessa. Sääntöjen muuttamisesta on mainittava
                            kokouskutsussa.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>4§ Klusterin sähköpostilistat</h3>
                        <p>
                            Klusterin käyttöön liittyy kolme sähköpostilistaa. Leppis-avaimet@helsinki.fi 
                            (myöhemmin avainlista) on tarkoitettu kaikkia avaimellisia koskevan tiedon 
                            välitykseen. Leppis-list@helsinki.fi (myöhemmin komitean lista) on tarkoitettu 
                            Leppätalokomitean sisäiseksi tiedotuskanavaksi. Leppis-info@helsinki.fi on 
                            tarkoitettu kaikkia avaimellisia koskettavan tärkeän tiedon välitykseen.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>Tilat ja niiden käyttö</h3>
                        <h3>5§ Klusterin käyttäjät</h3>
                        <p>
                            Klusteri on tarkoitettu kaikille järjestöjen jäsenille. Klusteria
                            käytettäessä on aina oltava paikalla kulkuoikeudellinen henkilö.
                            Kulkuoikeudella tarkoitetaan mukana olevaa kulkuavainta, jolla
                            tiloihin pääsee sisään kyseisenä ajankohtana. Kulkuoikeus on henkilökohtainen.

                            Tyhjälle klusterille saavuttaessa on tarkistettava tilat ja
                            ilmoitettava mahdollisista puutteista tai sotkuista avainlistalle.

                            Järjestöillä on lupa kutsua ulkopuolisia tahoja klusterille vieraakseen. 
                            Tällöin kutsuva järjestö on vastuussa vieraistaan ja paikalla on oltava 
                            vähintään yksi kulkuoikeudellinen henkilö vastaamassa. Järjestö voi erityisestä 
                            syystä Leppätalokomitean luvalla antaa ulkopuolisen tahon käyttää klusteria nimissään. 

                            Alaikäisten oleskelu klusterilla on ehdottomasti kielletty.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>6§ Kokoushuone</h3>
                        <p>
                            Kokoushuone on etupäässä kokouskäyttöön tarkoitettu tila, jonka käyttö
                            edellyttää varausta. Kokoushuone tulee varata viimeistään tilaisuuden
                            alkaessa. Kokoushuoneen siisteyteen on kiinnitettävä erityistä
                            huomiota. Kokoushuonetta ei voi käyttää juhlimistarkoitukseen.

                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
