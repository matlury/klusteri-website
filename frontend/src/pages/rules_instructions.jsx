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
                    <div className="rule-section">
                        <h3>7§ Kerhohuone</h3>
                        <p>
                            Kerhohuone on monenlaisiin tilaisuuksiin soveltuva tila, joka on
                            vapaasti käytettävissä varausten ulkopuolella. Kerhohuone tulee varata
                            viimeistään 24 tuntia ennen tilaisuutta. Jos tilaisuus ei ole avoin
                            kaikkien järjestöjen jäsenille, on tästä ilmoitettava
                            varauskalenterissa.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>8§ Oleskelutila</h3>
                        <p>
                            Oleskelutila on järjestöjen jäsenten vapaasti käytettävissä oleva
                            tila. Leppätalokomitean kokous voi erityisestä syystä myöntää
                            järjestölle oikeuden varata oleskelutila tai koko klusteri käyttöönsä.
                            Oleskelutilan avoin varaus kalenterissa ei edellytä komitean
                            hyväksyntää. Tällöin varausmerkintä on ensisijaisesti
                            ilmoitusluontoinen.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>9§ Säilytys- ja varastotilat</h3>
                        <p>
                            Jokaisella järjestöllä on oikeus kiinteään kaappiin klusterilla.
                            Kerhohuoneen ja oleskelutilan kaapit ja hyllyt on tarkoitettu
                            yhteiskäytössä oleville tavaroille. Suuren varastotilan hyllyt ovat 
                            tarkoitettu järjestöille tavaransäilytyspaikaksi. Hyllyt ovat järjestökohtaiset. 
                            Pieni varastotila on Matlun käytössä. Muu tavaroiden varastointi klusterilla
                            on sallittua maksimissaan viiden päivän ajan klusterin käyttöä häiritsemättä 
                            erillisellä ilmoituksella avainlistalle.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>10§ Yökäyttö</h3>
                        <p>
                            Yökäytöksi lasketaan klusteritiloissa oleskelu välillä 00.00 - 07.00,
                            ellei Leppätalokomitea ole muutoin määrännyt. Yökäytön alkaessa
                            jokaisen paikalla olevan järjestön on otettava yökäyttövastuu, ellei
                            toinen järjestö ota heitä vastuulleen. Yökäytön aikana klusterille
                            saapuvat kulkuoikeudelliset henkilöt ottavat yökäyttövastuun
                            itsestään ja seurueestaan, ellei toinen yökäyttövastuussa oleva 
                            ota heitä vastuulleen.

                            Vastuuhenkilön on lähetettävä yökäytöstä sähköpostiviesti avainlistalle. 
                            Kun järjestö poistuu, tai vastuuhenkilö vaihtuu, on myös tästä lähetettävä 
                            sähköpostiviesti avainlistalle.

                            YKV-viestin pitää sisältää etunimi, sukunimi ja järjestö tai järjestön
                            tunnettu lyhenne tai lempinimi, josta käy selkeästi ilmi järjestö. Sähköpostin
                            otsikosta tulee ilmetä yökäyttövastuun ottaminen.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>11§ Yökäytön vastuuhenkilö</h3>
                        <p>
                            Yökäytön vastuuhenkilö on kulkuoikeudellinen henkilö, joka on klusterin 
                            avaimellisten sähköpostilistalle ilmoittanut ottavansa yökäyttövastuun.
                            Vastuuhenkilöitä on yökäytön aikana toteltava klusterin käyttöön 
                            liittyvissä asioissa. Vastuuhenkilöllä on oikeus poistaa asiattomasti 
                            käyttäytyvä henkilö klusterilta.

                            Vastuuhenkilöiden on pidettävä klusteri kunnossa, ylläpidettävä
                            järjestystä ja valvottava sääntöjen noudattamista. Havaituista sääntörikkomuksista 
                            tulee ilmoittaa Leppätalokomitean puheenjohtajalle. Vastuuhenkilöt vastaavat 
                            klusterin siivoamisesta käytön päätteeksi.

                            YKV-viesteihin liittyvistä virheistä ruvetaan pitämään kirjaa, ja jos järjestöllä on
                            yhteensä kymmenen (10) kappaletta/kausi (nollautuu 1.2. ja 1.8.) YKV-viesteihin
                            liittyviä virheitä, annetaan tästä järjestölle sanktio. Sanktion määrittää
                            Leppätalokomitea. Kun yksittäisellä henkilöllä on tietty määrä virheitä, siitä seuraa
                            sanktioita virheiden määrän mukaisesti. Kolmesta (3) virheestä seuraa varoitus,
                            viidestä (5) virheestä yhden (1) kuukauden YKV-kielto ja 10 virheestä Leppätalokomitean
                            määrittämä sanktio. Tälläisiä YKV-virheitä pykälän 10§ puutteiden lisäksi ovat
                            mm. klusterilla oleilu yökäytön aikana ilman, että YKV-viestiä on lähetetty
                            (hyväksyttävä liukuma on 15 min yli YKV:n alun).

                            Jos YKV-pois viestiä ei ole tullut ollenkaan 07:30 mennessä, lasketaan tämä
                            vakavammaksi YKV-virheeksi. "Klusteri tyhjä, kaikki pois" tyyppinen viesti kuitenkin
                            kuittaa YKV:n loppuneeksi kaikkien puolesta.

                            Jos avaimellinen on YKV-sähköpostin mukaan vastuussa vain itsestään, tarkoittaa
                            tämä sitä, ettei hän aio päästää ketään muuta kuin itseään sisälle avaimillaan.
                            Tämä kuitenkin tarkoittaa, että avaimellisen on puututtava mahdollisiin
                            häiriötilanteisiin, ja oltava muulla tavoin vastuussa järjestyksestä klusterilla.
                            Aikaistetun YKV:n tapahtumien aikana vastuunotto vain itsestään ei ole mahdollista.

                            Leppätalokomitea voi antaa poikkeuksia tarvittaessa.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>12§ Tapahtuman järjestäminen klusterilla</h3>
                        <p>
                            Jos järjestö järjestää klusterilla tapahtuman on tästä tehtävä
                            merkintä klusterin sähköiseen varauskalenteriin.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>13§ Käyttäytymissäännöt</h3>
                        <p>
                            Vahvojen hajusteiden käyttö tai tupakointi ei ole sallittua sisätiloissa. 
                            Avonaisten juoma-astioiden vieminen eteiseen tai sitä pidemmälle on yleisen 
                            siisteyden nojalla kielletty. Roskat on vietävä niille osoitettuun paikkaan. 
                            Tilassa nukkuminen on ehdottomasti kielletty kaikkina aikoina ja kaikissa tilanteissa.

                            Muita rakennuksen käyttäjiä häiritsevä toiminta, kuten kovaääninen
                            musiikki, on kielletty aikavälillä 07.00 - 18.00.

                            Klusterilla oleskelu on kielletty aikavälillä 07.00-12.00. Leppätalokomitean 
                            kokous voi myöntää poikkeusluvan perustellusta syystä. Hiljainen siivoaminen, 
                            ruuan valmistus sekä tavaroiden nouto ja palautus on sallittu. Yllämainitusta 
                            toiminnasta on kuitenkin lähetettävä avainlistalle viesti.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>14§ Eläimet klusterilla</h3>
                        <p>
                            Eläinten tuominen klusterille on kielletty. Kielto ei koske opas- tai
                            avustajakoiria.
                        </p>
                    </div>
                    <div className="rule-section">
                    <h3>Hallinto ja päätöksenteko</h3>
                        <h3>15§ Leppätalokomitea</h3>
                        <p>
                            Klusteria hallinnoi Leppätalokomitea, jossa on yksi edustaja
                            jokaisesta järjestöstä. Järjestö voi nimittää myös varaedustajan. Järjestö 
                            voi vaihtaa edustajiansa ilmoittamalla tästä komitean puheenjohtajalle.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>16§ Leppätalokomitean puheenjohtaja</h3>
                        <p>
                            Leppätalokomitean puheenjohtajana toimii Matlun edustaja.
                            Puheenjohtaja toimii klusterin yhteyshenkilönä HYYn suuntaan ja vastaa
                            avainhallinnosta. Leppätalokomitea voi valita nimettyjen edustajien joukosta
                            varapuheenjohtajan, joka hoitaa puheenjohtajan tehtäviä tämän ollessa
                            estyneenä.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>17§ Leppätalokomitean kokoukset</h3>
                        <p>
                            Leppätalokomitea kokoontuu puheenjohtajan tai hänen estyneenä
                            ollessaan varapuheenjohtajan kutsusta tai kun vähintään kolme komitean
                            jäsenjärjestöä sitä vaatii. Leppätalokomitean kokoukset ovat
                            päätösvaltaisia, kun puheenjohtaja tai varapuheenjohtaja sekä yhteensä
                            vähintään neljä muuta komitean jäsentä ovat paikalla. Kokouskutsu tulee 
                            lähettää vähintään viisi vuorokautta ennen kokouksen alkua.

                            Äänestyksen mennessä tasan ratkaisee kokouksen puheenjohtajan kanta,
                            henkilövaaleissa ja suljetussa lippuäänestyksessä kuitenkin arpa.
                            Leppätalokomitean kokoukset ovat avoimia kaikille järjestöjen
                            jäsenille ellei komitea erityisistä syistä muuta päätä. Kokouksista
                            pidetään päätöspöytäkirjaa.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>18§ Leppätalokomitean puheenjohtaja</h3>
                        <p>
                            Leppätalokomitean puheenjohtajana toimii Matlun edustaja.
                            Puheenjohtaja toimii klusterin yhteyshenkilönä HYYn suuntaan ja vastaa
                            avainhallinnosta. Leppätalokomitea voi valita nimettyjen edustajien joukosta
                            varapuheenjohtajan, joka hoitaa puheenjohtajan tehtäviä tämän ollessa
                            estyneenä.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>16§ Leppätalokomitean puheenjohtaja</h3>
                        <p>
                            Leppätalokomitean puheenjohtajana toimii Matlun edustaja.
                            Puheenjohtaja toimii klusterin yhteyshenkilönä HYYn suuntaan ja vastaa
                            avainhallinnosta. Leppätalokomitea voi valita nimettyjen edustajien joukosta
                            varapuheenjohtajan, joka hoitaa puheenjohtajan tehtäviä tämän ollessa
                            estyneenä.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>16§ Leppätalokomitean puheenjohtaja</h3>
                        <p>
                            Leppätalokomitean puheenjohtajana toimii Matlun edustaja.
                            Puheenjohtaja toimii klusterin yhteyshenkilönä HYYn suuntaan ja vastaa
                            avainhallinnosta. Leppätalokomitea voi valita nimettyjen edustajien joukosta
                            varapuheenjohtajan, joka hoitaa puheenjohtajan tehtäviä tämän ollessa
                            estyneenä.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rules_and_Instructions;
