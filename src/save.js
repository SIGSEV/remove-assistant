const db = require('./db')

module.exports = function save(item) {
  db
    .get('tweets')
    .push(item)
    .write()
}
