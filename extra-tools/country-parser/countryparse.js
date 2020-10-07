const axios = require("axios")
const fs = require("fs")
const COUNTRIES_CSV_URL = "https://raw.githubusercontent.com/google/dspl/master/samples/google/canonical/countries.csv"

axios.get(COUNTRIES_CSV_URL).then(
  function (response) {
    var csvdata = response.data;
    const allLines = csvdata.split(/\r\n|\n/);
    let by_country_name = {}
    let by_country_code = {}
    for (let line of allLines) {
      let linefields = line.split(',')
      if (linefields[0] === "name")
        continue
      if (linefields[0])
        by_country_code[linefields[0].trim()] = {
          coords: [(linefields[1] ? linefields[1] : "").trim(),
          (linefields[2] ? linefields[2] : "").trim()],
          name: (linefields[3] ? linefields[3] : "").trim().replace('"', "").replace('"', "").replace('"', "").replace('"', "")
        }

      if (linefields[3])
        by_country_name[linefields[3].trim().replace('"', "").replace('"', "").replace('"', "").replace('"', "").replace('"', "").toUpperCase()] = {
          coords: [(linefields[1] ? linefields[1] : "").trim(),
          (linefields[2] ? linefields[2] : "").trim()],
          code: (linefields[0] ? linefields[0] : "").trim()
        }
    }

    fs.writeFileSync("countries_by_name.json", JSON.stringify(by_country_name))
    fs.writeFileSync("countries_by_code.json", JSON.stringify(by_country_code))

  }
).catch(function (error) {
  // handle error
  console.log(error);
})
  .then(function () {
    // always executed
  });

