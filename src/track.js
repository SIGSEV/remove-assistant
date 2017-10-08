const watch = require('./watch')
const screen = require('./screen')
const save = require('./save')
const twitter = require('./twitter')

const getTweetURL = tweet =>
  `https://mobile.twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

const streams = {}

const refresh = async () => {
  const { users } = await twitter.get('friends/list', {})
  const names = users.map(f => f.screen_name)

  Object.keys(streams).forEach(k => {
    if (!names.includes(k)) {
      streams[k].destroy()
    }
  })

  names.forEach(user => {
    streams[user] = watch(user, async tweet => {
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
  })

  setTimeout(refresh, 1e3 * 60 * 60)
}

module.exports = function track() {
  refresh()
}
