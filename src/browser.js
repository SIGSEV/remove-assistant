const puppeteer = require('puppeteer')

let browser
puppeteer
  .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  .then(b => (browser = b))
  .catch(err => {
    console.log(`x Cant launch browser: ${err}`)
    process.exit(1)
  })

module.exports = function getBrowser() {
  return browser
}

// process.on('SIGINT', async () => {
//   if (browser) {
//     await browser.close()
//   }
//   process.exit()
// })
