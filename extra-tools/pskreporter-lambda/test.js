var x = require('./index')

x.handler({queryStringParameters:{ callsign: "LU8GCJ", devMode:true }}).then((res)=>{console.log(res)})
