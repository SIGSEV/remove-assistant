const puppeteer = require('puppeteer')

const getTweetURL = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

module.exports = async function screen(tweet) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  const url = getTweetURL(tweet)
  await page.goto(url)
  await page.screenshot({
    path: 'hey.jpg',
  })
  await browser.close()
}
