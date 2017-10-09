require('dotenv').config()

const track = require('./track')
const verify = require('./verify')

// verify that nobody deleted their tweets! omg we need to help!
verify()

track()
