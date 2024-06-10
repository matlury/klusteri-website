import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";

const Rules_and_Instructions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { t } = useTranslation();

  return (
    <div>
      <h1>
        {t("rules_1")}
      </h1>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#555", marginTop: "30px" }}>
          {t("rules_2")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="rule-section">
          <h3>{t("rules_3")}</h3>
            <p>
            {t("rules_4")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_5")}</h3>
            <p>
            {t("rules_6")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_7")}</h3>
            <p>
            {t("rules_8")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_9")}</h3>
            <p>
            {t("rules_10")}
            </p>
          </div>
          <div className="rule-section">
            <h2 style={{ color: "#555", marginTop: "30px" }}>
            {t("rules_11")}
            </h2>
            <h3>{t("rules_12")}</h3>
            <p>
            {t("rules_13")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_14")}</h3>
            <p>
            {t("rules_15")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_16")}</h3>
            <p>
            {t("rules_17")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_18")}</h3>
            <p>
            {t("rules_19")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_20")}</h3>
            <p>
            {t("rules_21")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_22")}</h3>
            <p>
            {t("rules_23")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_24")}</h3>
            <p>
            {t("rules_25")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_26")}</h3>
            <p>
            {t("rules_27")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_28")}</h3>
            <p>
            {t("rules_29")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_30")}</h3>
            <p>
            {t("rules_31")}
            </p>
          </div>
          <div className="rule-section">
            <h2 style={{ color: "#555", marginTop: "30px" }}>
            {t("rules_32")}
            </h2>
            <h3>{t("rules_33")}</h3>
            <p>
            {t("rules_34")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_35")}</h3>
            <p>
            {t("rules_36")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_37")}</h3>
            <p>
            {t("rules_38")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_39")}</h3>
            <p>
            {t("rules_40")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_41")}</h3>
            <p>
            {t("rules_42")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_43")}</h3>
            <p>
            {t("rules_44")}
            </p>
          </div>
          <div className="rule-section">
            <h2 style={{ color: "#555", marginTop: "30px" }}>
            {t("rules_45")}
            </h2>
            <h3>{t("rules_46")}</h3>
            <p>
            {t("rules_47")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_48")}</h3>
            <p>
            {t("rules_49")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_50")}</h3>
            <p>
            {t("rules_51")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_52")}</h3>
            <p>
            {t("rules_53")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_54")}</h3>
            <p>
            {t("rules_55")}
            </p>
          </div>
          <div className="rule-section">
            <h2 style={{ color: "#555", marginTop: "30px" }}>
            {t("rules_56")}
            </h2>
            <h3>{t("rules_57")}</h3>
            <p>
            {t("rules_58")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_59")}</h3>
            <p>
            {t("rules_60")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_61")}</h3>
            <p>
            {t("rules_62")}
            </p>
          </div>
          <div className="rule-section">
            <h2 style={{ color: "#555", marginTop: "30px" }}>
            {t("rules_63")}
            </h2>
            <h3>{t("rules_64")}</h3>
            <p>
            {t("rules_65")}
            </p>
          </div>
          <div className="rule-section">
            <h3>{t("rules_66")}</h3>
            <p>
            {t("rules_67")}
            </p>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#555", marginTop: "30px" }}>
            Siivoussäännöt
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="rule-section">
            <h3>Tapahtuman jälkeinen siivous</h3>
            <ul>
              <li>Huonekalut paikoilleen</li>
              <li>Sälä paikoilleen</li>
              <li>Astioiden tiskaus & keittiön tasojen pyyhintä</li>
              <li>Tölkkien ja pullojen keruu</li>
              <li>Keräysastioiden tyhjennys</li>
              <li>Tarvittaessa lattioiden lakaisu</li>
              <li>Mahdollisten kurajälkien poispesu</li>
              <li>Mahdollisten tahmalaikkujen pyyhintä pöydiltä</li>
              <li>
                Klusterin ulkopuolinen aula ja ulko-oven edusta (roskat,
                tumpit, pullot…)
              </li>
              <li>
                Ilmoita, jos siivousvälineissä on puutteita
                (leppis-list@helsinki.fi)
              </li>
              <li>Klusterin yleisilme SIISTI</li>
            </ul>
          </div>
          <div>
            <h3>Viikkosiivouksen tshek-lista</h3>
            <ul>
              <li>Siivoa sekä yleistila, kerhohuone että kokoushuone</li>
              <li>
                Sälä pois sieltä minne ei kuulu (mutta eihän semmoista ole,
                eihän?)
              </li>
              <li>
                Tölkkien ja pullojen keruu (tölkit ei sekajätteen sekaan vaan
                metallikeräykseen)
              </li>
              <li>
                Lattioiden imurointi/lakaisu (imuroi myös matot ja niiden
                aluset)
              </li>
              <li>
                Lattioiden pesu (ota moppi, ämpäri, vettä ja pesuainetta, MYÖS
                SOHVIEN TAKAA)
              </li>
              <li>Pöytien pyyhintä</li>
              <li>
                Likatahrat, runsaat käpälän jäljet tms pois seinistä ja ovista
              </li>
              <li>
                Tiskaus & keittiön siivous (paitsi eihän tiskiä ole, kun jengi
                on ne ite hoitanu)
              </li>
              <li>
                Vessat (pönttöjen pesu, lattioiden lakaisu & pesu, peilin
                pyyhintä, lavuaarin puhdistus, roskisten tyhjennys, paperin
                täyttö)
              </li>
              <li>Kuramattojen pudistelu</li>
              <li>Puhdista sohvat tarpeen vaatiessa</li>
              <li>
                Tarpeen mukaan myös klusterin ulkopuolisen aulan ja ulko-oven
                edustan siivous
              </li>
              <li>Rättien pesu ja asiallisesti kuivumaan jättö</li>
              <li>
                Roskien vienti jätehuoneeseen (energia, bio, paperi, pahvi,
                metalli, seka. Jätehuone löytyy kun kävelet ulos talosta ja
                kierrät nurkan taa myötäpäivää.)
              </li>
              <li>
                Ilmoita, jos siivousvälineissä on puutteita
                (leppis-list@helsinki.fi)
              </li>
              <li>
                Ilmoita, jos klusteri saastainen (leppis-list@helsinki.fi)
              </li>
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#555", marginTop: "30px" }}>
            Matlu-klusterin turvallisen tilan periaatteet
          </h2>
        </AccordionSummary>
        <AccordionDetails>
        <div>
            <h3 style={{ color: "red", fontSize: "1.2em" }}>
              Hätätilanteessa soita yleiseen hätänumeroon 112.
            </h3>
          </div>
          <div>
            <h3>Kunnioita toisia ja heidän omaa tilaa sekä koskemattomuutta</h3>
            <p>
              Pidä huolta ilmapiiristä kunnioittamalla muita ihmisiä. Älä syrji,
              ahdistele, kiusaa, painosta tai käy käsiksi. Älä tee oletuksia
              toisen identiteetistä, sukupuolesta, terveydentilasta tai
              seksuaalisesta suuntautumisesta tai siitä, mistä he ovat kotoisin.
              <br />
              <br />
              Älä koskettele muita ilman heidän lupaansa. Muista, ettet voi
              tietää ihmisen rajoja ellet kysy. Minkäänlaista seksuaalista
              häirintää sen eri muodoin ei hyväksytä.
              <br />
              <br />
              Minkäänlaista häiritsevää, seksististä, rasistista, homo- tai
              transfobista, loukkaavaa tai väkivaltaista tai puhetta tai
              käytöstä ei hyväksytä. Muista, että vaikka jokin on sinusta
              esimerkiksi hauskaa tai vitsikästä, se voi jostain toisesta tuntua
              epämiellyttävältä tai ahdistavalta.
              <br />
              <br />
              Mikäli koet itse tai havaitset muiden harjoittamaa häirintää, mene
              väliin tai ilmoita asiasta vastuuhenkilöille. Raportoi
              väkivaltaisesta käytöksestä tai vakavasta häirinnästä välittömästi
              eteenpäin tapahtumajärjestäjälle, vastuuhenkilölle,
              häirintäyhdyshenkilöille tai Leppätalokomitean puheenjohtajalle.
              <br />
              <br />
              Vastuuhenkilö on kuka tahansa klusterin kulkuluvallinen henkilö.
              Klo 00-07 on olemassa erityisessä yökäyttövastuussa olevia
              henkilöitä, jotka voit selvittää kysymällä. Jos itse vastuuhenkilö
              on osa ongelmaa, ota yhteyttä toiseen vastuuhenkilöön tai
              tarvittaessa Leppätalokomitean puheenjohtajaan.
            </p>
          </div>
          <div>
            <h3>Välitä ja pidä huolta</h3>
            <p>
              Pidä huolta itsestäsi. Älä saata itseäsi tarkoituksella sellaiseen
              tilaan, ettet pystyisi esimerkiksi pääsemään kotiin millä tahansa
              hetkellä. Jos et jostain syystä pysty huolehtimaan itsestäsi,
              pyydäthän rohkeasti apua.
              <br />
              <br />
              Pidä huolta muista. Jos huomaat, ettei joku pysty pitämään huolta
              itsestään, älä jätä häntä heitteille. Mikäli joku pyytää sinulta
              apua, auta parhaasi mukaan. Huolehdi, että hän saa apua
              esimerkiksi ilmoittamalla asiasta vastuuhenkilöille.
            </p>
          </div>
          <div>
            <h3>Kommunikoi</h3>
            <p>
              Olemalla avoin ja ystävällinen, luot ympäristöä, jossa
              kommunikoiminen on helpompaa. Jos jokin ei ole mukavaa, sanothan
              siitä. Mikäli omasta käytöksestäsi huomautetaan, otathan
              palautteen vastaan rakentavasti. Käytöksestäsi huomauttavat eivät
              loukkaa sinua ihmisenä, vaan auttavat sinua kehittymään.
              Jokaisella on jotain opittavaa, vahingossa törppöilystä selviää
              usein ymmärtäväisyydellä ja anteeksipyynnöllä.
            </p>
          </div>
          <div>
            <h3>Yhteystietoja:</h3>
            <ul>
              <li>
                Leppätalokomitean puheenjohtaja Vili Järvinen, <a href="mailto:vilijarvinen2311@gmail.com">vilijarvinen2311@gmail.com</a>
              </li>
              <li>
                Matlun häirintäyhdyshenkilöt <a href="mailto:hairinta@matlu.fi">hairinta@matlu.fi</a>
                <ul>
                  <li>Niclas Forsman, <a href="mailto:niklas.forsman@helsinki.fi">niklas.forsman@helsinki.fi</a></li>
                  <li>Jenna Vahtera, <a href="mailto:jenna.vahtera@helsinki.fi">jenna.vahtera@helsinki.fi</a></li>
                  <li>Anna Monni, <a href="mailto:anna.monni@helsinki.fi">anna.monni@helsinki.fi</a></li>
                  <li>Markus Holopainen, <a href="mailto:markus.x.holopainen@helsinki.fi">markus.x.holopainen@helsinki.fi</a></li>
                </ul>
              </li>
              <li>
                Leppätalokomitean sähköpostilista, <a href="mailto:leppis-list@helsinki.fi">leppis-list@helsinki.fi</a>
              </li>
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Rules_and_Instructions;
