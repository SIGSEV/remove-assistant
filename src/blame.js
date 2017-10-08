const path = require('path')
const fs = require('fs')

const twitter = require('./twitter')
const db = require('./db')

const SHOTS_DIR = path.resolve(__dirname, '../shots')

function postTweet(tweet, imgID) {
  return new Promise(resolve => {
    twitter.post(
      'statuses/update',
      {
        status: `.@${tweet.user}, did you just deleted that? ;)`,
        media_ids: imgID,
      },
      () => {
        resolve()
      },
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

module.exports = async function blame(tweet) {
  console.log(`>> Notifying @${tweet.user} that he just deleted its tweet ;)`)
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
