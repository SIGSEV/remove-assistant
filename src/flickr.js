const Flickr = require('flickr-sdk')

const auth = Flickr.OAuth.createPlugin(
  process.env.FLICKR_CONSUMER_KEY,
  process.env.FLICKR_CONSUMER_SECRET,
  process.env.FLICKR_OAUTH_TOKEN,
  process.env.FLICKR_OAUTH_TOKEN_SECRET,
)

const fl = new Flickr(process.env.FLICKR_CONSUMER_KEY)

exports.uploadPicture = async function uploadPicture(filePath, options) {
  const res = await new Flickr.Upload(auth, filePath, { ...options })
  const photo_id = res.body.photoid._content
  const info = await fl.photos.getSizes({ photo_id })
  return info.body.sizes.size.find(s => s.label === 'Original').source
}

exports.removePicture = function removePicture(url) {
  const fl = new Flickr(auth)
  const photo_id = url.substr(url.lastIndexOf('/') + 1).split('_')[0]
  return fl.photos.delete({ photo_id })
}
