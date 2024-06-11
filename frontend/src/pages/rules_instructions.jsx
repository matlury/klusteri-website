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
          {t("rules_68")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="rule-section">
            <h3>{t("rules_69")}</h3>
            <ul>
              <li>{t("rules_70")}</li>
              <li>{t("rules_71")}</li>
              <li>{t("rules_72")}</li>
              <li>{t("rules_73")}</li>
              <li>{t("rules_74")}</li>
              <li>{t("rules_75")}</li>
              <li>{t("rules_76")}</li>
              <li>{t("rules_77")}</li>
              <li>
              {t("rules_78")}
              </li>
              <li>
              {t("rules_79")}
              </li>
              <li>{t("rules_80")}</li>
            </ul>
          </div>
          <div>
            <h3>{t("rules_81")}</h3>
            <ul>
              <li>{t("rules_82")}</li>
              <li>
              {t("rules_83")}
              </li>
              <li>
              {t("rules_84")}
              </li>
              <li>
              {t("rules_85")}
              </li>
              <li>
              {t("rules_86")}
              </li>
              <li>{t("rules_87")}</li>
              <li>
              {t("rules_88")}
              </li>
              <li>
              {t("rules_89")}
              </li>
              <li>
              {t("rules_90")}
              </li>
              <li>{t("rules_91")}</li>
              <li>{t("rules_92")}</li>
              <li>
              {t("rules_93")}
              </li>
              <li>{t("rules_94")}</li>
              <li>
              {t("rules_95")}
              </li>
              <li>
              {t("rules_96")}
              </li>
              <li>
              {t("rules_97")}
              </li>
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#555", marginTop: "30px" }}>
          {t("rules_98")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
        <div>
            <h3 style={{ color: "red", fontSize: "1.2em" }}>
            {t("rules_99")}
            </h3>
          </div>
          <div>
            <h3>{t("rules_100")}</h3>
            <p>
            {t("rules_101")}
              <br />
              <br />
              {t("rules_102")}
              <br />
              <br />
              {t("rules_103")}
              <br />
              <br />
              {t("rules_104")}
              <br />
              <br />
              {t("rules_105")}
            </p>
          </div>
          <div>
            <h3>{t("rules_106")}</h3>
            <p>
            {t("rules_107")}
              <br />
              <br />
              {t("rules_108")}
            </p>
          </div>
          <div>
            <h3>{t("rules_109")}</h3>
            <p>
            {t("rules_110")}
            </p>
          </div>
          <div>
            <h3>{t("rules_111")}</h3>
            <ul>
              <li>
              {t("rules_112")} Vili Järvinen, <a href="mailto:vilijarvinen2311@gmail.com">vilijarvinen2311@gmail.com</a>
              </li>
              <li>
              {t("rules_113")} <a href="mailto:hairinta@matlu.fi">hairinta@matlu.fi</a>
                <ul>
                  <li>Niclas Forsman, <a href="mailto:niklas.forsman@helsinki.fi">niklas.forsman@helsinki.fi</a></li>
                  <li>Jenna Vahtera, <a href="mailto:jenna.vahtera@helsinki.fi">jenna.vahtera@helsinki.fi</a></li>
                  <li>Anna Monni, <a href="mailto:anna.monni@helsinki.fi">anna.monni@helsinki.fi</a></li>
                  <li>Markus Holopainen, <a href="mailto:markus.x.holopainen@helsinki.fi">markus.x.holopainen@helsinki.fi</a></li>
                </ul>
              </li>
              <li>
              {t("rules_114")}, <a href="mailto:leppis-list@helsinki.fi">leppis-list@helsinki.fi</a>
              </li>
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Rules_and_Instructions;
