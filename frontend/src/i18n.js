import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from './translations.json';
import moment from "moment";
import "moment/locale/fi";

// the translations
const resources = translations;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fi",
    interpolation: {
      escapeValue: false
    }
  });

// Sync moment locale with i18next
moment.locale(i18n.language);
i18n.on('languageChanged', (lng) => {
  moment.locale(lng);
});

export default i18n;