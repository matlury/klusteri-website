import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Contacts = () => {
 
  const { t } = useTranslation();
  return (
    <div className="textbox">
      <h1>Domus Gaudium</h1>
      <p>
        {t("contacts_1")}
      </p>
      <Link to="/christina_regina" data-testid="christina-regina-link">
        <h1>Christina Regina</h1>
      </Link>
      <p>
        {t("contacts_2")}
      </p>
      <h1>{t("contacts_3")}</h1>
      <p>{t("contacts_4")}</p>
      <h1>{t("contacts_5")}</h1>
      <p>{t("contacts_6")}</p> 
      <p>{t("contacts_7")}</p>
      <h1>{t("contacts_8")}</h1>
    </div>
  );
};

export default Contacts;
