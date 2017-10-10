const screen = require('./screen')
const save = require('./save')
const twitter = require('./twitter')

const getTweetURL = tweet =>
  `https://mobile.twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

module.exports = function track(retry = 5) {
  const stream = twitter.stream('user', {})

  stream.on('data', async tweet => {
    const nick = tweet.user.screen_name
    if (nick === 'removeAssistant') {
      return
    }

    const type = tweet.retweeted_status ? 'retweet' : 'tweet'
    console.log(`>> @${nick} just ${type}ed`)

    const url = getTweetURL(tweet)

    try {
      const shot = await screen(url)
      const item = {
        id: tweet.id_str,
        user: tweet.user.screen_name,
        url,
        shot,
        type,
      }
      save(item)
      console.log(`>> saved a tweet from ${nick}`)
    } catch (err) {
      console.log(`>> cant save tweet: ${err}`)
    }
  })

  stream.on('error', error => {
    retry--
    console.log(`x Problem: ${error}`)
    stream.destroy()
    if (!retry) {
      console.log(`x Stopping server (too many retries.,.)`)
      process.exit(1)
    }
    console.log(`>> restarting... (remaining attempts: ${retry})`)
    setTimeout(() => {
      track(retry)
    }, 2e3)
  })
}
