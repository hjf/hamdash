var x = require('./index')

x.handler({queryStringParameters:{ lat: "-27.27", lon: "-59.00" }}).then((res)=>{console.log(res)})
