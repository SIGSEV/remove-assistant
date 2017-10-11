const request = require('request')

const twitter = require('./twitter')
const db = require('./db')

const sentences = {
  all: [
    u => `.@${u} you should be careful in the future, I won't always be there to help you! 😊`,
    (u, t) =>
      `Oh nooo! 😢 @${u} one of your precious ${t}s got removed! Not pointing any fingers though.. 🇷🇺`,
    (u, t) =>
      `Dear @${u}, I know you didn't want to delete that ${t}, so I kept it warm for you! 😊`,
    (u, t) => `Psst, @${u} :) Don't worry your ${t} is not lost! Here it is:`,
    (u, t) => `I enjoyed @${u} ${t} so much that I took a picture of it!`,
  ],
  tweet: [
    u => `Hey @${u}! You apparently clicked on the delete thingy without paying attention! 😁`,
    u =>
      `Those deletion hacks are more and more common these days, @${u} just got affected too.. 😟`,
    u =>
      `Hey @${u}, you might have misclicked on the delete button but I got your back! Have a nice day! 🤗`,
    u => `This tweet from @${u} made history and needed to be preserved.`,
  ],
  retweet: [],
}

const getRandom = (u, t) => {
  const arr = sentences.all.concat(sentences[t])
  return arr[Math.floor(Math.random() * arr.length)](u, t)
}

function postTweet(tweet, imgID) {
  return new Promise(resolve => {
    twitter.post(
      'statuses/update',
      {
        status: getRandom(tweet.user, tweet.type),
        media_ids: imgID,
      },
      () => {
        resolve()
      },
    )
  })
}

function getBuffer(url) {
  return new Promise((resolve, reject) => {
    request({ url, encoding: null }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(err)
      }
    })
  })
}

function uploadMedia(shotUrl) {
  return new Promise(async (resolve, reject) => {
    const media = await getBuffer(shotUrl)
    twitter.post('media/upload', { media }, (err, media) => {
      if (err) {
        return reject(err)
      }
      resolve(media.media_id_string)
    })
  })
}

module.exports = async function help(tweet) {
  console.log(`>> Notifying @${tweet.user} that he just deleted his/her/they tweet ;)`)
  try {
    const imgID = await uploadMedia(tweet.shotUrl)
    await postTweet(tweet, imgID)
    db
      .get('tweets')
      .remove({ id: tweet.id })
      .write()
  } catch (err) {
    console.log(`x Problem posting tweet ${err}`)
  }
}
