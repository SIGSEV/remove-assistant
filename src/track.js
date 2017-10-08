const screen = require('./screen')
const save = require('./save')
const twitter = require('./twitter')

const getTweetURL = tweet =>
  `https://mobile.twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

module.exports = function track() {
  const stream = twitter.stream('user', {})

  stream.on('data', async tweet => {
    const nick = tweet.user.screen_name
    if (nick === 'idontforgt') {
      return
    }

    console.log(`>> @${nick} just tweeted`)

    const url = getTweetURL(tweet)
    const shot = await screen(url)

    const item = {
      id: tweet.id_str,
      user: tweet.user.screen_name,
      url,
      shot,
    }

    save(item)
    console.log(`>> saved a tweet from ${nick}`)
  })

  stream.on('error', error => {
    console.log(`x Problem: ${error}`)
  })
}
