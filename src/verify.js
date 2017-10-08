const request = require('request')

const db = require('./db')
const help = require('./help')

// verify every 10s
const RATE = 10e3

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async function verify() {
  const tweets = db.get('tweets').value()
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i]
    const isStillHere = await urlOK(tweet.url)
    if (!isStillHere) {
      await help(tweet)
    }
  }
  await wait(RATE)
  verify()
}

function urlOK(url) {
  return new Promise(resolve => {
    request(url, (err, res) => {
      if (err) {
        return resolve(false)
      }
      resolve(res.statusCode === 200)
    })
  })
}
