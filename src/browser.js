const puppeteer = require('puppeteer')

const browserPromise = puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })

browserPromise.catch(err => {
  console.log(`x Cant launch browser: ${err}`)
  process.exit(1)
})

module.exports = browserPromise

if (process.platform !== 'darwin') {
  process.on('SIGINT', async () => {
    const browser = await browserPromise
    if (browser) {
      await browser.close()
    }
    process.exit()
  })
}
