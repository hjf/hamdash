var https = require('https');

var cache = {}

exports.handler = async (event) => {
  let response = {
    statusCode: 200,
    body: "",
  };
  let callsign = event.queryStringParameters.callsign;
  if (callsign === undefined) {
    response.statusCode = 400
    return response;
  }

  let rv = { error: null, data: null }

  try {
    if (event.queryStringParameters.devMode) {
      rv = { "statusCode": 200, "body": { "error": null, "data": { "monitors": 4904, "spots": 546, "monitors_per_mode": { "FT8": 4376, "JS8": 164, "CW": 21, "FT4": 222, "PSK31": 23, "JT65": 9, "OPERA": 22, "MSK144": 20, "WSPR": 3, "FST4W": 21, "ROS": 7, "FST4": 3, "JT9": 2, "JT6M": 3, "PI4": 2, "RTTY": 2, "CW (KY C": 1, "MFSK32": 1, "OLIVIA-8": 1, "CONTESTI": 1 }, "spots_per_band": { "10.1": 391, "5.4": 152 } } } }
      response.body = JSON.stringify(rv)
      return response
    }
    let cached = cache[callsign]
    if (cached) {
      if (cached.expires > new Date()) {
        response.body = cached.payload
        return response
      }
    }
    let results = await worker(callsign)
    rv.data = {
      monitors: results.activeReceiver.length,
      spots: results.receptionReport.length,
      monitors_per_mode: {},
      spots_per_band: {}

    }
    for (let mon of results.activeReceiver) {
      if (!mon.mode)
        continue;
      if (rv.data.monitors_per_mode[mon.mode] === undefined)
        rv.data.monitors_per_mode[mon.mode] = 0
      rv.data.monitors_per_mode[mon.mode]++
    }

    for (let mon of results.receptionReport) {
      if (!mon.frequency)
        continue;

      let f = `${(parseFloat(mon.frequency) / 1000000.0).toFixed(1)}`

      if (rv.data.spots_per_band[f] === undefined)
        rv.data.spots_per_band[f] = 0
      rv.data.spots_per_band[f]++
    }

    console.log(rv.data)
  } catch (err) {
    rv.error = JSON.stringify(err)
  }

  response.body = JSON.stringify(rv)

  cache[callsign] = {
    expires: new Date(Date.now() + 1000 * 60 * 6),
    payload: response.body
  }



  return response
};

function worker(callsign) {

  return new Promise((resolve, reject) => {

    let options = {
      host: 'pskreporter.info',
      path: `/cgi-bin/pskquery5.pl?callback=""&flowStartSeconds=-900&callsign=${callsign}`
    };

    https.request(options, (res) => {
      let str = '';
      //another chunk of data has been received, so append it to `str`
      res.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been received, so we just print it out here
      res.on('end', function () {
        try {
          resolve(JSON.parse(str))
        }
        catch (err) {
          reject(str)
        }
      });

      res.on('timeout', function () {
        reject("timeout")
      });

    }).end();
  })
}