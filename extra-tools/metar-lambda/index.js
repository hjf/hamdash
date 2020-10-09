var axios = require('axios')
var xml2js = require('xml2js')
const DATA_URL_BASE = 'https://www.aviationweather.gov/adds/dataserver_current/httpparam'

exports.handler = async (event) => {
  let response = {
    statusCode: 200,
    body: null,
  };
  let lat = event.queryStringParameters.lat;
  let lon = event.queryStringParameters.lon;
  try {
    if (!event.queryStringParameters.lat)
      throw ""
    if (!event.queryStringParameters.lon)
      throw ""
    lat = parseFloat(lat).toFixed(2);
    lon = parseFloat(lon).toFixed(2);
  } catch (err) {
    response.statusCode = 500

    return response;
  }
  let rv = { error: null, metar: "" }

  try {
    let res = await axios.get(DATA_URL_BASE, {
      params: {
        dataSource: "metars",
        requestType: "retrieve",
        format: "xml",
        radialDistance: `20;${lon},${lat}`,
        hoursBeforeNow: 3,
        mostRecent: "true"
      }
    });

    if (res.status === 200) {

      let jsonResponse = await xml2js.parseStringPromise(res.data, { explicitArray: false, ignoreAttrs: true })
      if (jsonResponse.response &&
        jsonResponse.response.data &&
        jsonResponse.response.data.METAR &&
        jsonResponse.response.data.METAR.raw_text) {

        rv.metar = jsonResponse.response.data.METAR.raw_text;
      } else {
        rv.error = JSON.stringify(jsonResponse.response.errors)
      }
    } else {
      rv.error = { code: res.status, err: res.error }
    }

  } catch (error) {
    rv.error = JSON.stringify(error)
  }

  response.body = JSON.stringify(rv)
  return response
};
