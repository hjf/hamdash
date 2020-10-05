const getBrowserLanguage = (short) => {
  let candidate = navigator.userLanguage || (navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || navigator.browserLanguage || navigator.systemLanguage || 'en'
  if (short)
    return candidate.substring(0, 2)
  return candidate
};

export { getBrowserLanguage }