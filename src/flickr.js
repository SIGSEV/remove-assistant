const Flickr = require('flickr-sdk')

const auth = Flickr.OAuth.createPlugin(
  process.env.FLICKR_CONSUMER_KEY,
  process.env.FLICKR_CONSUMER_SECRET,
  process.env.FLICKR_OAUTH_TOKEN,
  process.env.FLICKR_OAUTH_TOKEN_SECRET,
)

const fl = new Flickr(process.env.FLICKR_CONSUMER_KEY)

module.exports = async function flickr(path, payload) {
  const res = await new Flickr.Upload(auth, path, {
    ...payload,
  })

  const photo_id = res.body.photoid._content
  const info = await fl.photos.getSizes({
    photo_id,
  })

  return info.body.sizes.size.find(s => s.label === 'Original').source
}
