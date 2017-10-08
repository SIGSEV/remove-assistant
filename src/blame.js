const twitter = require('./twitter')
const db = require('./db')

module.exports = function blame(tweet) {
  console.log(`>> Notifying @${tweet.user} that he just deleted its tweet ;)`)
  return new Promise(resolve => {
    twitter.post(
      'statuses/update',
      {
        status: `.@${tweet.user}, did you just deleted that? ;)`,
      },
      () => {
        db
          .get('tweets')
          .remove({ id: tweet.id })
          .write()
        resolve()
      },
    )
  })
}
