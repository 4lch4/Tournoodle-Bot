const moment = require('moment-timezone')
const UTC = 'UTC'

const DEFAULT_DATE_FORMAT = 'MM.DD.Y @ HH:mm:ss'

module.exports = class Tools {
  get formattedUTCTime () {
    return moment.tz(UTC).format(DEFAULT_DATE_FORMAT)
  }
}
