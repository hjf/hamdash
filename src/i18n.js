import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';


// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "WWV.MAIN_TITLE": "Solar Conditions",
      "WWV.LOADING": "Loading...",
      "WWV.SFI": "SFI",
      "WWV.PLANETARY_A_INDEX": "A-index",
      "WWV.PLANETARY_K_INDEX": "K-index",
      "WWV.UPDATED": "Updated",
      "LOGIN.CALLSIGN": "Callsign",
      "LOGIN.LOCATOR": "Locator",
      "LOGIN.WELCOME": "Welcome to HamDash.",
      "LOGIN.WELCOME2": "Enter your callsign and locator to customize your dashboard.",
      "LOGIN.LANGUAGE": "Language",
      "LOGIN.BUTTON": "Enter",
      "CLOOKUP.TITLE": "Callsign Lookup",
      "CLOOKUP.EXPLAIN": "This module uses QRZ.com to perform lookups. Enter your username and password to be able to view data. No account? Register at ",
      "CLOOKUP.USERNAME": "QRZ.com Username",
      "CLOOKUP.PASSWORD": "QRZ.com Password",
      "CLOOKUP.CALLSIGN": "Callsign",
      "CLOOKUP.LOGIN": "Login",
      "CLOOKUP.LOOKUP": "Find",
      "LOGIN.PRIVACYPOLICY":"Cookie policy: This sites uses no cookies. Privacy policy: This is a static website. All of your data is stored in your browser.",
      "CLOOKUP.CALLSIGN_PLACEHOLDER":"enter the callsign to lookup"
      
    }
  },
  es: {
    translation: {
      "WWV.MAIN_TITLE": "Condiciones solares",
      "LOGIN.CALLSIGN": "Señal Distintiva",
      "LOGIN.LOCATOR": "Grid Locator",
      "LOGIN.WELCOME": "Bienvenido a HamDash.",
      "LOGIN.WELCOME2": "Ingrese su señal distintiva y su grid locator para personalizar su tablero.",
      "LOGIN.LANGUAGE": "Idioma",
      "LOGIN.BUTTON": "Ingresar",

    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    lng: "en",
    
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      lookupLocalStorage: 'lang',
    }
  });

export default i18n;