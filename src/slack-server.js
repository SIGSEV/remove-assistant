const http = require('http')

const twitter = require('./twitter')

module.exports = function createServer(port = 3124) {
  const server = http.createServer(handler)
  server.listen(port, err => {
    if (err) {
      console.log('x Problem with the slack server', err)
      process.exit(1)
    }
    console.log(`slack server listening on port ${port}`)
  })
}

const twitterCall = (method, url, payload = {}) =>
  new Promise((resolve, reject) => {
    twitter[method](url, payload, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

const updateFriendship = (type, screen_name) =>
  twitterCall('post', `friendships/${type === 'AMl' ? 'destroy' : 'create'}`, {
    screen_name,
  })

const actions = {
  follow: body => updateFriendship('AMI', body.text),
  unfollow: body => updateFriendship('AMl', body.text),
  delete: body => twitterCall('post', `statuses/destroy/${body.text}`),
}

async function handler(req, res) {
  try {
    const body = await parseBody(req)
    const cmd = req.url.substr(1)
    if (actions[cmd]) {
      await actions[cmd](body)
      res.writeHead(200)
      res.end('OK')
    } else {
      throw new Error('No such command, bitch(e).')
    }
  } catch (err) {
    res.writeHead(400)
    console.log(err)
    res.end(err.message)
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => (data += chunk))
    req.on('end', () => {
      try {
        const body = data
          .split('&')
          .map(pair => pair.split('=').map(t => decodeURIComponent(t)))
          .reduce((acc, pair) => ({ ...acc, [pair[0]]: pair[1] }), {})
        resolve(body)
      } catch (err) {
        reject(err)
      }
    })
  })
}
