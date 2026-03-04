import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";
import KnowledgeBaseSearch from "../components/KnowledgeBaseSearch";

const Rules_and_Instructions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSearchResult = (result) => {
    const id = result.id;
    let panel = 'panel1';

    // Determine which panel contains the rule based on ID ranges
    if (id >= 1 && id <= 67) panel = 'panel1';
    else if (id >= 68 && id <= 97 || id >= 115) panel = 'panel2';
    else if (id >= 98 && id <= 114) panel = 'panel3';

    setExpanded(panel);

    // Scroll to the element after a short delay to allow accordion to open
    setTimeout(() => {
      const element = document.getElementById(`rule-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect
        element.style.backgroundColor = 'rgba(144, 181, 87, 0.2)';
        setTimeout(() => {
          element.style.backgroundColor = 'transparent';
        }, 2000);
      }
    }, 300);
  };

  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', p: { xs: 1, sm: 3 } }}>
      <h1>
        {t("rules_1")}
      </h1>

      <Box sx={{
        position: 'sticky',
        top: { xs: 56, sm: 64 }, // Match responsive AppBar heights
        zIndex: 10,
        bgcolor: '#fafbf8', // Fully opaque theme background
        pt: 2,
        pb: 2,
        mb: 2,
        mx: { xs: -1, sm: -3 },
        px: { xs: 1, sm: 3 },
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.03)'
      }}>

        <KnowledgeBaseSearch onResultClick={handleSearchResult} />
      </Box>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ borderRadius: '8px !important', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#558b2f", margin: "10px 0" }}>
            {t("rules_2")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="rule-section" id="rule-3">
            <h3>{t("rules_3")}</h3>
            <p id="rule-4">
              {t("rules_4")}
            </p>
          </div>
          <div className="rule-section" id="rule-5">
            <h3>{t("rules_5")}</h3>
            <p id="rule-6">
              {t("rules_6")}
            </p>
          </div>
          <div className="rule-section" id="rule-7">
            <h3>{t("rules_7")}</h3>
            <p id="rule-8">
              {t("rules_8")}
            </p>
          </div>
          <div className="rule-section" id="rule-9">
            <h3>{t("rules_9")}</h3>
            <p id="rule-10">
              {t("rules_10")}
            </p>
          </div>
          <div className="rule-section" id="rule-11">
            <h2 style={{ color: "#558b2f", marginTop: "30px" }}>
              {t("rules_11")}
            </h2>
            <div id="rule-12">
              <h3>{t("rules_12")}</h3>
              <p id="rule-13">
                {t("rules_13")}
              </p>
            </div>
          </div>
          <div className="rule-section" id="rule-14">
            <h3>{t("rules_14")}</h3>
            <p id="rule-15">
              {t("rules_15")}
            </p>
          </div>
          <div className="rule-section" id="rule-16">
            <h3>{t("rules_16")}</h3>
            <p id="rule-17">
              {t("rules_17")}
            </p>
          </div>
          <div className="rule-section" id="rule-18">
            <h3>{t("rules_18")}</h3>
            <p id="rule-19">
              {t("rules_19")}
            </p>
          </div>
          <div className="rule-section" id="rule-20">
            <h3>{t("rules_20")}</h3>
            <p id="rule-21">
              {t("rules_21")}
            </p>
          </div>
          <div className="rule-section" id="rule-22">
            <h3>{t("rules_22")}</h3>
            <p id="rule-23">
              {t("rules_23")}
            </p>
          </div>
          <div className="rule-section" id="rule-24">
            <h3>{t("rules_24")}</h3>
            <p id="rule-25">
              {t("rules_25")}
            </p>
          </div>
          <div className="rule-section" id="rule-26">
            <h3>{t("rules_26")}</h3>
            <p id="rule-27">
              {t("rules_27")}
            </p>
          </div>
          <div className="rule-section" id="rule-28">
            <h3>{t("rules_28")}</h3>
            <p id="rule-29">
              {t("rules_29")}
            </p>
          </div>
          <div className="rule-section" id="rule-30">
            <h3>{t("rules_30")}</h3>
            <p id="rule-31">
              {t("rules_31")}
            </p>
          </div>
          <div className="rule-section" id="rule-32">
            <h2 style={{ color: "#558b2f", marginTop: "30px" }}>
              {t("rules_32")}
            </h2>
            <div id="rule-33">
              <h3>{t("rules_33")}</h3>
              <p id="rule-34">
                {t("rules_34")}
              </p>
            </div>
          </div>
          <div className="rule-section" id="rule-35">
            <h3>{t("rules_35")}</h3>
            <p id="rule-36">
              {t("rules_36")}
            </p>
          </div>
          <div className="rule-section" id="rule-37">
            <h3>{t("rules_37")}</h3>
            <p id="rule-38">
              {t("rules_38")}
            </p>
          </div>
          <div className="rule-section" id="rule-39">
            <h3>{t("rules_39")}</h3>
            <p id="rule-40">
              {t("rules_40")}
            </p>
          </div>
          <div className="rule-section" id="rule-41">
            <h3>{t("rules_41")}</h3>
            <p id="rule-42">
              {t("rules_42")}
            </p>
          </div>
          <div className="rule-section" id="rule-43">
            <h3>{t("rules_43")}</h3>
            <p id="rule-44">
              {t("rules_44")}
            </p>
          </div>
          <div className="rule-section" id="rule-45">
            <h2 style={{ color: "#558b2f", marginTop: "30px" }}>
              {t("rules_45")}
            </h2>
            <div id="rule-46">
              <h3>{t("rules_46")}</h3>
              <p id="rule-47">
                {t("rules_47")}
              </p>
            </div>
          </div>
          <div className="rule-section" id="rule-48">
            <h3>{t("rules_48")}</h3>
            <p id="rule-49">
              {t("rules_49")}
            </p>
          </div>
          <div className="rule-section" id="rule-50">
            <h3>{t("rules_50")}</h3>
            <p id="rule-51">
              {t("rules_51")}
            </p>
          </div>
          <div className="rule-section" id="rule-52">
            <h3>{t("rules_52")}</h3>
            <p id="rule-53">
              {t("rules_53")}
            </p>
          </div>
          <div className="rule-section" id="rule-54">
            <h3>{t("rules_54")}</h3>
            <p id="rule-55">
              {t("rules_55")}
            </p>
          </div>
          <div className="rule-section" id="rule-56">
            <h2 style={{ color: "#558b2f", marginTop: "30px" }}>
              {t("rules_56")}
            </h2>
            <div id="rule-57">
              <h3>{t("rules_57")}</h3>
              <p id="rule-58">
                {t("rules_58")}
              </p>
            </div>
          </div>
          <div className="rule-section" id="rule-59">
            <h3>{t("rules_59")}</h3>
            <p id="rule-60">
              {t("rules_60")}
            </p>
          </div>
          <div className="rule-section" id="rule-61">
            <h3>{t("rules_61")}</h3>
            <p id="rule-62">
              {t("rules_62")}
            </p>
          </div>
          <div className="rule-section" id="rule-63">
            <h2 style={{ color: "#558b2f", marginTop: "30px" }}>
              {t("rules_63")}
            </h2>
            <div id="rule-64">
              <h3>{t("rules_64")}</h3>
              <p id="rule-65">
                {t("rules_65")}
              </p>
            </div>
          </div>
          <div className="rule-section" id="rule-66">
            <h3>{t("rules_66")}</h3>
            <p id="rule-67">
              {t("rules_67")}
            </p>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ borderRadius: '8px !important', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#558b2f", margin: "10px 0" }}>
            {t("rules_68")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="rule-section" id="rule-69">
            <h3>{t("rules_69")}</h3>
            <ul>
              <li id="rule-70">{t("rules_70")}</li>
              <li id="rule-71">{t("rules_71")}</li>
              <li id="rule-72">{t("rules_72")}</li>
              <li id="rule-73">{t("rules_73")}</li>
              <li id="rule-74">{t("rules_74")}</li>
              <li id="rule-75">{t("rules_75")}</li>
              <li id="rule-76">{t("rules_76")}</li>
              <li id="rule-77">{t("rules_77")}</li>
              <li id="rule-78">
                {t("rules_78")}
              </li>
              <li id="rule-79">
                {t("rules_79")}
              </li>
              <li id="rule-80">{t("rules_80")}</li>
            </ul>
          </div>
          <div className="rule-section" id="rule-81">
            <h3>{t("rules_81")}</h3>
            <ul>
              <li id="rule-82">{t("rules_82")}</li>
              <li id="rule-83">
                {t("rules_83")}
              </li>
              <li id="rule-84">
                {t("rules_84")}
              </li>
              <li id="rule-85">
                {t("rules_85")}
              </li>
              <li id="rule-86">
                {t("rules_86")}
              </li>
              <li id="rule-87">{t("rules_87")}</li>
              <li id="rule-88">
                {t("rules_88")}
              </li>
              <li id="rule-89">
                {t("rules_89")}
              </li>
              <li id="rule-90">
                {t("rules_90")}
              </li>
              <li id="rule-91">{t("rules_91")}</li>
              <li id="rule-92">{t("rules_92")}</li>
              <li id="rule-93">
                {t("rules_93")}
              </li>
              <li id="rule-94">{t("rules_94")}</li>
              <li id="rule-95">
                {t("rules_95")}
              </li>
              <li id="rule-96">
                {t("rules_96")}
              </li>
              <li id="rule-97">
                {t("rules_97")}
              </li>
            </ul>
            <div id="rule-115">
              <h3>{t("rules_115")}</h3>
              <ol>
                <li id="rule-116">{t("rules_116")}</li>
                <li id="rule-117">
                  {t("rules_117")}
                </li>
                <li id="rule-118">{t("rules_118")}</li>
              </ol>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ borderRadius: '8px !important', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 style={{ color: "#558b2f", margin: "10px 0" }}>
            {t("rules_98")}
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div id="rule-99">
            <h3 style={{ color: "red", fontSize: "1.2em" }}>
              {t("rules_99")}
            </h3>
          </div>
          <div className="rule-section" id="rule-100">
            <h3>{t("rules_100")}</h3>
            <p>
              <span id="rule-101">{t("rules_101")}</span>
              <br />
              <br />
              <span id="rule-102">{t("rules_102")}</span>
              <br />
              <br />
              <span id="rule-103">{t("rules_103")}</span>
              <br />
              <br />
              <span id="rule-104">{t("rules_104")}</span>
              <br />
              <br />
              <span id="rule-105">{t("rules_105")}</span>
            </p>
          </div>
          <div className="rule-section" id="rule-106">
            <h3>{t("rules_106")}</h3>
            <p>
              <span id="rule-107">{t("rules_107")}</span>
              <br />
              <br />
              <span id="rule-108">{t("rules_108")}</span>
            </p>
          </div>
          <div className="rule-section" id="rule-109">
            <h3>{t("rules_109")}</h3>
            <p id="rule-110">
              {t("rules_110")}
            </p>
          </div>
          <div className="rule-section" id="rule-111">
            <h3>{t("rules_111")}</h3>
            <ul>
              <li id="rule-112">
                {t("rules_112")} Emma Laasonen
              </li>
              <li id="rule-113">
                {t("rules_113")} <a href="mailto:hairinta@matlu.fi">hairinta@matlu.fi</a>
                <ul>
                  <li>Heljä Lehtinen</li>
                  <li>Jonna Rönn</li>
                  <li>Matti Ylhäisi</li>
                  <li>Tony Brusin</li>
                </ul>
              </li>
              <li id="rule-114">
                {t("rules_114")}, <a href="mailto:leppis-list@helsinki.fi">leppis-list@helsinki.fi</a>
              </li>
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Rules_and_Instructions;
