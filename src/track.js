const watch = require('./watch')
const screen = require('./screen')
const save = require('./save')

const getTweetURL = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

module.exports = function track(user) {
  watch(user, async tweet => {
    console.log(`>> @${user} just tweeted`)

    const url = getTweetURL(tweet)
    const shot = await screen(url)

    const item = {
      id: tweet.id_str,
      user: tweet.user.screen_name,
      url,
      shot,
    }
    save(item)
    console.log(`>> saved a tweet from ${user}`)
  })
}
