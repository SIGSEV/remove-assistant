require('dotenv').config()
const Twitter = require('twitter')

const watch = require('./watch')
const screen = require('./screen')

const getTweetURL = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

watch(client, 'idontforgt', async tweet => {
  const url = getTweetURL(tweet)
  const imgName = await screen(url)
  console.log(imgName)
})
