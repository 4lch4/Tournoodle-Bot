const path = require('path')
const Replies = require('require-all')({
  dirname: path.join(__dirname, 'strings'),
  resolve: function (Reply) { return Reply }
})

const sqlite = require('sqlite3').verbose()

module.exports = msg => {
  return Replies.en_US.commands.tcreate
}
let db = new sqlite.Database('./db/tourneys.db', sqlite.OPEN_READWRITE, err => {
  if (err) console.error(err)
  else console.log(`Connected to the in-memory SQLite database.`)
})

const closeDb = () => {
  db.close(err => {
    if (err) return console.error(err)
    else return console.log('Connection closed.')
  })
}
