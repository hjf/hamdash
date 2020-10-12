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
      "LOGIN.PRIVACYPOLICY": "Cookie policy: This sites uses no cookies. Privacy policy: This is a static website. All of your data is stored in your browser.",
      "CLOOKUP.CALLSIGN_PLACEHOLDER": "Callsign",
      "NTPTIME.LABEL_LOCAL_TIME": "Local",
      "NTPTIME.LABEL_TIME_ERROR": "This device is off by {{offset}}ms",
      "NTPTIME.TITLE": "UTC Time",
      "MAP.MAP_TITLE": "World Map",
      "MAP.MAP_DISTANCE": "Distance: {{distance}}{{km_or_mi}}",
      "MAP.BEARING": "Bearing: {{bearing}}°",
      "WEATHER.WINDS": "N,NNE,NE,ENE,E,ESE,SE,SSE,S,SSW,SW,WSW,W,WNW,NW,NNW",
      "PSKREPORTER.MONITORS":"Monitors",
      "PSKREPORTER.SPOTTED_ME":"You spotted",
      "PSKREPORTER.SPOTTED_BY_ME":"You were spotted",
      "PSKREPORTER.LINK":"Full data at",
      "PSKREPORTER.TITLE":"Digimode Spots",
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



      "WWV.LOADING": "Cargando...",
      "WWV.SFI": "IFS",
      "WWV.PLANETARY_A_INDEX": "Índice A",
      "WWV.PLANETARY_K_INDEX": "Índice K",
      "WWV.UPDATED": "Actualizado",
      "CLOOKUP.TITLE": "Búsqueda de Indicativos",
      "CLOOKUP.EXPLAIN": "Este modulo utiliza QRZ.com para realizar búsquedas. Ingrese su usuario y contraseña de QRZ para ver datos. ¿No tiene cuenta? Regístrese en ",
      "CLOOKUP.USERNAME": "Usuario QRZ.com",
      "CLOOKUP.PASSWORD": "Contraseñ QRZ.com",
      "CLOOKUP.CALLSIGN": "Indicativo",
      "CLOOKUP.LOGIN": "Iniciar Sesión",
      "CLOOKUP.LOOKUP": "Buscar",
      "LOGIN.PRIVACYPOLICY": "Cookie policy: This sites uses no cookies. Privacy policy: This is a static website. All of your data is stored in your browser.",
      "CLOOKUP.CALLSIGN_PLACEHOLDER": "ingrese la señal distintiva",
      "NTPTIME.LABEL_LOCAL_TIME": "Local",
      "NTPTIME.LABEL_TIME_ERROR": "Este dispositivo tiene un error de {{offset}}ms",
      "NTPTIME.TITLE": "Hora UTC",
      "MAP.MAP_TITLE": "Mapa",
      "MAP.MAP_DISTANCE": "Locator: {{locator}}, Distancia: {{distance}}{{km_or_mi}}",
      "WEATHER.WINDS": "N,NNE,NE,ENE,E,ESE,SE,SSE,S,SSO,SO,OSO,O,ONO,NO,NNO"
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