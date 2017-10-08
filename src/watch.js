const twitter = require('./twitter')

module.exports = function watch(user, onTweet) {
  console.log(`>> Watching [@${user}]`)

  const stream = twitter.stream('user', { with: user })

  stream.on('data', tweet => {
    // prevent blaming myself. lel.
    if (tweet.text.includes('did you just')) {
      return
    }
    onTweet(tweet)
  })

  stream.on('error', error => {
    console.log(`x Problem connecting to ${user} stream: ${error}`)
  })

  return stream
}
