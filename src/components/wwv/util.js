function parseWwvTxt(wwv) {
  if (wwv === null || wwv === undefined)
    return null

  const allLines = wwv.split(/\r\n|\n/);
  let wwvdata = {}
  let isvalid = false
  for (let line of allLines) {
    line = line.trim()
    let splitline = line.split(' ')

    if (line === ':Product: Geophysical Alert Message wwv.txt')
      isvalid = true

    if (line.startsWith(':Issued: ')) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      wwvdata.date = Date.UTC(
        Number(splitline[1]),
        Number(months.indexOf(splitline[2])),
        Number(splitline[3]),
        Number(splitline[4].substring(0, 2)),
        Number(splitline[4].substring(2, 4)),
        0
      )

    }

    if (line.startsWith('Solar flux')) {
      wwvdata.sfi = Number(splitline[2]);//force numeric
      wwvdata.a_index = Number(splitline[7].replace(".", ""))
    }

    if (line.startsWith('The estimated planetary')) {
      wwvdata.k_index = Number(splitline[11].replace(".", ""))
    }

  }

  if (isvalid)
    return wwvdata

  return null
}

export { parseWwvTxt }
