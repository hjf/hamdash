import { parseWwvTxt } from './util'

const axios = require('axios').default;

const WWV_FILE_URL = 'https://services.swpc.noaa.gov/text/wwv.txt';
const FETCHER_KEY = 'wwv_data'

async function fetchData() {
  const rv = {
    error: null,
    data: null,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 12)//12hr
  }

  try {
    let res = await axios.get(WWV_FILE_URL);
    if (res.status === 200) {
      rv.data = parseWwvTxt(res.data);
      return rv
    }
    throw res.error || "error"

  } catch (error) {
    rv.error = error
  }
  return rv;
};

async function fetch() {
  let wwvData = localStorage.getItem(FETCHER_KEY)

  if (wwvData == null)
    wwvData = {}
  else
    wwvData = JSON.parse(wwvData)

  if (wwvData.expires === undefined || new Date(wwvData.expires) < new Date()) {
    wwvData = await fetchData();
    if (wwvData.error === null)
      localStorage.setItem(FETCHER_KEY, JSON.stringify(wwvData))
  } else {
  }
  return wwvData
}


export default { fetch: fetch, FETCHER_KEY: FETCHER_KEY };