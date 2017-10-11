require('dotenv').config()

const { removePicture } = require('../src/flickr')

const url = process.argv[2]
if (!url) {
  throw new Error('you must provide an url')
}

removePicture(url)
  .then(() => console.log('Successfully deleted'))
  .catch(err => {
    console.log(err)
    process.exit(0)
  })
