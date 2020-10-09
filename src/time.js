var dayjs = require('dayjs')
require('dayjs/locale/es')

var localizedFormat = require('dayjs/plugin/localizedFormat')
var relativeTime = require('dayjs/plugin/relativeTime')
var localeData = require('dayjs/plugin/localeData')
var utc = require('dayjs/plugin/utc')

dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(localeData)

export default dayjs;