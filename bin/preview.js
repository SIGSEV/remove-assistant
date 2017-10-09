const screen = require('../src/screen')

const url = process.argv[2]
if (!url) {
  throw new Error('you must provide an url')
}

screen(url).then(imgName => console.log(imgName))
