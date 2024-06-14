import React from "react";
import christinaregina from "../ChristinaRegina.png";
import { useTranslation } from "react-i18next";

const ChristinaRegina = () => {
  const { t } = useTranslation();
  return (
    <div className="textbox">
      <h1>Christina Regina</h1>
      <p>
        {t("christina_regina_1")}
      </p>
      <p>
        {t("front_1")} {t("front_2")} {t("christina_regina_2")}
      </p>
      <p>
        {t("christina_regina_3")}
      </p>
      <img src={christinaregina} id="map" width="400" height="300" alt="Logo" />
    </div>
  );
};

export default ChristinaRegina;
