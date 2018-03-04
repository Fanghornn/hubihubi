const steam = require('./steam/run')
const origin = require('./origin/run')
const asyn = require('async')

runners = [steam/*, origin*/]

asyn.map(runners, (runner) => {
    runner.run()
})