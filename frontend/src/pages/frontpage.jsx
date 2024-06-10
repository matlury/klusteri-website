import React from "react";
import { useTranslation } from "react-i18next";

const FrontPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="textbox">
      <h1>Ilotalo</h1>
      <p> ”sub hoc tecto cives academici excoluntur”?</p>
      <p>
        {t("front_1")}
      </p>
      <p>
        {t("front_2")}
      </p>
    </div>
  );
};

export default FrontPage;
