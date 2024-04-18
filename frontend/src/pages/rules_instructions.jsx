import React, { useState } from 'react';

const Rules_and_Instructions = () => {
    const [showRules, setShowRules] = useState(false);
    const [showCleaningRules, setShowCleaningRules] = useState(false);

    const handleClick = () => {
        setShowRules(true);
        setShowCleaningRules(false);
    };

    const handleShowCleaningRules = () => {
        setShowRules(false);
        setShowCleaningRules(true);
    };

    const handleClose = () => {
        setShowRules(false);
        setShowCleaningRules(false);
    };

    return (
        <div className='textbox'>
            <h1 style={{ color: '#333', borderBottom: '2px solid #333', paddingBottom: '10px' }}>Säännöt ja ohjeet </h1>
            {showRules || showCleaningRules ? (
                <button onClick={handleClose}>Sulje säännöt</button>
            ) : (
                <div>
                    <button onClick={handleClick}>Näytä käyttösäännöt</button>
                    <br />
                    <br />
                    <button onClick={handleShowCleaningRules}>Näytä siivoussäännöt</button>
                </div>
            )}
            {showRules && (
                <div className='rules'>
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Matlu-klusterin käyttösäännöt</h2>
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
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Tilat ja niiden käyttö</h2>
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
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Hallitus ja päätöksenteko</h2>
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
                        <h3>18§ Klusterikokous</h3>
                        <p>
                            Merkittävissä klusteria koskevissa asioissa päätösvaltaa käyttää
                            klusterikokous. Kokouksessa kullakin järjestöllä on käytettävissä yksi
                            ääni, jota käyttää järjestön hallituksen valtuuttama edustaja tai
                            hänen varaedustajansa. Varaedustaja käyttää äänioikeuttaan, mikäli
                            varsinainen edustaja on poissa tai on muutoin estynyt käyttämään
                            äänioikeuttaan.

                            Edustajilla tulee olla järjestön antama valtakirja
                            edustusoikeudestaan. Äänestyksen mennessä tasan ratkaisee
                            puheenjohtajan kanta, henkilövaaleissa ja suljetussa
                            lippuäänestyksessä kuitenkin arpa. Klusterikokouksissa on puhe- ja
                            läsnäolo-oikeus kaikilla järjestöjen jäsenillä. Kokouksista pidetään
                            päätöspöytäkirjaa.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>19§ Klusterikokouksissa päätettävät asiat</h3>
                        <p>
                            Klusterikokoukset kutsuu koolle Leppätalokomitea. Kokouskutsu on
                            lähetettävä järjestöille viimeistään kolme viikkoa ennen kokousta.
                            Käyttösääntöjen muuttaminen ja muut erityisen merkittävät asiat on
                            mainittava kokouskutsussa, muut asiat viimeistään viikkoa ennen
                            kokousta toimitettavalla esityslistalla.

                            Klusterikokous voi kuitenkin 3/4 enemmistöllä päättää, että asia
                            käsitellään kiireellisenä, vaikka sitä ei ole esityslistalla. Asiaa,
                            josta on mainittava kokouskutsussa, ei voi käsitellä kiireellisenä.
                            Klusterikokouksella on oikeus ottaa päätettäväkseen
                            Leppätalokomitealle kuuluva asia sekä muuttaa Leppätalokomitean
                            päätöksiä.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>20§ Klusterin ylläpito ja irtaimisto</h3>
                        <p>
                            Matlu vastaa klusterin ylläpidosta ja juoksevista kuluista.
                            Järjestöjen odotetaan osallistuvan kustannuksiin suhteessa
                            käyttäjämääriinsä. Klusterille yhteisillä varoilla hankittu irtaimisto
                            on Matlun omaisuutta.
                        </p>
                    </div>
                    <div className="rule-section">
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Avaimet ja lukitukset</h2>
                        <h3>21§ Avainhallinto</h3>
                        <p>
                            Klusterin avainrekisteriä ylläpitää Leppätalokomitean puheenjohtaja.
                            Leppätalokomitealla on oikeus ottaa avain pois väärinkäytöksiin
                            syyllistyneeltä henkilöltä.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>22§ Klusterin kulkuluvat</h3>
                        <p>
                            Järjestö voi perustellusta syystä myöntää kulkuluvan klusterille jäsenelleen 
                            ilmoittamalla tästä HYYlle ja Leppätalokomitean puheenjohtajalle. Kulkuluvan 
                            myöntämisestä henkilölle, jonka kulkulupa on otettu pois väärinkäytösten takia,
                            päättää Leppätalokomitea. Järjestö voi ottaa nimissään olevan
                            kulkuluvan pois ilmoittamalla tästä Leppätalokomitean
                            puheenjohtajalle.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>23§ Sisätilojen avaimet</h3>
                        <p>
                            Jokaisella järjestöllä on oikeus riittävään määrään avaimia kokoushuoneeseen ja
                            kerhotilaan sekä varastoihin. Avaimet ovat aina yksittäisen
                            henkilön nimissä, mutta niitä voidaan säilyttää lukitussa kaapissa tai
                            muussa riittävän turvallisessa tilassa järjestön virkailijoiden
                            saatavilla.
                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>24§ Vastuu klusterin käytöstä</h3>
                        <p>
                            Klusteria käytettäessä jollain läsnäolijalla on oltava tilan käyttöön oikeuttava 
                            kulkulupa. Jokainen kulkuluvallinen vastaa klusterilla omasta sekä vastuullaan 
                            olevien henkilöiden toiminnasta. Jokainen kulkulupa on sekä kulkuluvan haltijan 
                            että luvan myöntäneen järjestön vastuulla.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>25§ Klusterin ulko-ovet</h3>
                        <p>
                            Klusterin uloskäynnit pidetään lukittuna. Rakennuksen muihin tiloihin ei saa
                            mennä ilman lupaa.

                        </p>
                    </div>
                    <div className="rule-section">
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Siisteys ja siivoaminen</h2>
                        <h3>26§ Kengätön tila</h3>
                        <p>
                            Ulkokengät tulee jättää eteiseen. Jos ulkokenkiä joudutaan
                            poikkeuksellisesti käyttämään klusterilla esimerkiksi tavaroita
                            kuljetettaessa, tulee lattiat siivota välittömästi tämän jälkeen.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>27§ Klusterin siisteys</h3>
                        <p>
                            Jokaisen käyttäjän tulee siivota jälkensä viimeistään poistuessaan.
                            Varauksen päättyessä sekä viimeisten käyttäjien poistuessa
                            varaamattomista tiloista tulee käytetyt tilat siivota vähintään yhtä
                            hyvään kuntoon kuin saavuttaessa.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>28§ Klusterin siivoaminen</h3>
                        <p>
                            Klusteri siivotaan viikoittain. Leppätalokomitea jakaa siivousvuorot ja 
                            tarvittaessa velvoittaa järjestöt myös muunlaiseen siivoukseen. 
                            Siivousvälineiden hankinnan koordinoi Matlun klusterivastaava. 

                        </p>
                    </div>
                    <div className="rule-section">
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Väärinkäytökset ja laiminlyönti</h2>
                        <h3>29§ Vahinkojen hyvittäminen</h3>
                        <p>
                            Järjestöt hyvittävät väärinkäytökset ja laiminlyönnit toimimalla
                            klusterin yhteiseksi hyväksi Leppätalokomitean päättämällä tavalla. Järjestöt 
                            ovat vastuussa Matlun omistamassa irtaimistossa ilmenevistä vahingoista, 
                            jotka eivät ole aiheutuneet normaalista kulumisesta.
                            ssa.

                        </p>
                    </div>
                    <div className="rule-section">
                        <h3>30§ Käyttöoikeuksien rajoittaminen</h3>
                        <p>
                            Jos väärinkäytös tai laiminlyönti on vakava tai järjestö syyllistyy
                            sellaiseen toistuvasti, voi Leppätalokomitean kokous päättää järjestön
                            käyttöoikeuksien rajoittamisesta määräajaksi. Järjestö ei saa
                            osallistua päätöksentekoon sen käyttöoikeuksien rajoittamisesta, mutta
                            sillä on oikeus tulla kuulluksi.

                            Henkilökohtaisten käyttöoikeuksien rajoittamisesta vakavissa väärinkäytös- 
                            tai laiminlyöntitapauksissa päättää Leppätalokomitea.
                        </p>
                    </div>
                </div>
            )}
        {showCleaningRules && (
                <div className='cleaning-rules'>
                    <h2 style={{ color: '#555', marginTop: '30px' }}>Siivoussäännöt</h2>
                    <div>
                        <h3>Tapahtuman jälkeinen siivous</h3>
                        <ul>
                            <li>- Huonekalut paikoilleen</li>
                            <li>- Sälä paikoilleen</li>
                            <li>- Astioiden tiskaus & keittiön tasojen pyyhintä</li>
                            <li>- Tölkkien ja pullojen keruu</li>
                            <li>- Keräysastioiden tyhjennys</li>
                            <li>- Tarvittaessa lattioiden lakaisu</li>
                            <li>- Mahdollisten kurajälkien poispesu</li>
                            <li>- Mahdollisten tahmalaikkujen pyyhintä pöydiltä</li>
                            <li>- Klusterin ulkopuolinen aula ja ulko-oven edusta (roskat, tumpit, pullot…)</li>
                            <li>- Ilmoita, jos siivousvälineissä on puutteita (leppis-list@helsinki.fi)</li>
                            <li>- Klusterin yleisilme SIISTI</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Viikkosiivouksen tshek-lista</h3>
                        <ul>
                            <li>- Siivoa sekä yleistila, kerhohuone että kokoushuone</li>
                            <li>- Sälä pois sieltä minne ei kuulu (mutta eihän semmoista ole, eihän?)</li>
                            <li>- Tölkkien ja pullojen keruu (tölkit ei sekajätteen sekaan vaan metallikeräykseen)</li>
                            <li>- Lattioiden imurointi/lakaisu (imuroi myös matot ja niiden aluset)</li>
                            <li>- Lattioiden pesu (ota moppi, ämpäri, vettä ja pesuainetta, MYÖS SOHVIEN TAKAA)</li>
                            <li>- Pöytien pyyhintä</li>
                            <li>- Likatahrat, runsaat käpälän jäljet tms pois seinistä ja ovista</li>
                            <li>- Tiskaus & keittiön siivous (paitsi eihän tiskiä ole, kun jengi on ne ite hoitanu)</li>
                            <li>- Vessat (pönttöjen pesu, lattioiden lakaisu & pesu, peilin pyyhintä, lavuaarin puhdistus, roskisten tyhjennys, paperin täyttö)</li>
                            <li>- Kuramattojen pudistelu</li>
                            <li>- Puhdista sohvat tarpeen vaatiessa</li>
                            <li>- Tarpeen mukaan myös klusterin ulkopuolisen aulan ja ulko-oven edustan siivous</li>
                            <li>- Rättien pesu ja asiallisesti kuivumaan jättö</li>
                            <li>- Roskien vienti jätehuoneeseen (energia, bio, paperi, pahvi, metalli, seka. Jätehuone löytyy kun kävelet ulos talosta ja kierrät nurkan taa myötäpäivää.)</li>
                            <li>- Ilmoita, jos siivousvälineissä on puutteita (leppis-list@helsinki.fi)</li>
                            <li>- Ilmoita, jos klusteri saastainen (leppis-list@helsinki.fi)</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rules_and_Instructions;