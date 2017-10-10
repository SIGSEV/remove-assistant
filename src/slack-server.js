const http = require('http')

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

async function handler(req, res) {
  try {
    const body = await parseBody(req)
    console.log(req.url)
    console.log(body)
    res.writeHead(200)
    res.end('OK')
  } catch (err) {
    res.writeHead(500)
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
        const body = JSON.parse(data)
        resolve(body)
      } catch (err) {
        reject(err)
      }
    })
  })
}
