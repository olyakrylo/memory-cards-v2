import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import en from "./en.json";
import ru from "./ru.json";

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    keySeparator: ".",
  });
