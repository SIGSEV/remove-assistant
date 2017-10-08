module.exports = function watch(client, user, onTweet) {
  console.log(`>> Watching [@${user}]`)
  const stream = client.stream('user', { with: user })
  stream.on('data', onTweet)
  stream.on('error', error => {
    throw error
  })
}
