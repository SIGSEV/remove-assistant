const path = require('path')
const fs = require('fs')

const twitter = require('./twitter')
const db = require('./db')

const SHOTS_DIR = path.resolve(__dirname, '../shots')

const sentences = [
  u =>
    `Hey @${u}! You apparently clicked on the delete button without paying attention! 😁`,
  u =>
    `.@${u} you should be careful in the future, I won't always be there to help you! 😊`,
  u =>
    `Oh nooo! 😢 @${u} one of your precious tweets got removed! Not pointing any fingers though.. 🇷🇺`,
  u =>
    `Those deletion hacks are more and more common these days, @${u} just got affected too.. 😟`,
  u =>
    `Hey @${u}, you might have misclicked on the delete button but I got your back! Have a nice day! 🤗`,
]

const getRandom = u => sentences[Math.floor(Math.random() * sentences.length)](u)

function postTweet(tweet, imgID) {
  return new Promise(resolve => {
    twitter.post(
      'statuses/update',
      {
        status: getRandom(tweet.user),
        media_ids: imgID,
      },
      () => {
        resolve()
      }
    )
  })
}

function uploadMedia(imgName) {
  const imgPath = path.resolve(SHOTS_DIR, imgName)
  const imgData = fs.readFileSync(imgPath) // eslint-disable-line no-sync
  return new Promise((resolve, reject) => {
    twitter.post('media/upload', { media: imgData }, (err, media) => {
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
    const imgID = await uploadMedia(tweet.shot)
    await postTweet(tweet, imgID)
    db
      .get('tweets')
      .remove({ id: tweet.id })
      .write()
  } catch (err) {
    console.log(`x Problem posting tweet ${err}`)
  }
}
