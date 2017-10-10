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
    const isLost = await check404(tweet.url)
    if (isLost) {
      await help(tweet)
    }
  }
  await wait(RATE)
  verify()
}

function check404(url) {
  return new Promise(resolve => {
    request(url, (err, res) => {
      resolve(err ? false : res.statusCode === 404)
    })
  })
}
