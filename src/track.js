const watch = require('./watch')
const screen = require('./screen')
const save = require('./save')

const getTweetURL = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

module.exports = function track(user) {
  watch(user, async tweet => {
    console.log(`>> @${user} just tweeted`)
    const url = getTweetURL(tweet)
    const shot = await screen(url)
    save({ id: tweet.id_str, url, shot, lastCheck: new Date() })
    console.log(`>> saved a tweet from ${user}`)
  })
}
