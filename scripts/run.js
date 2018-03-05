const steam = require('./steam/run')
const origin = require('./origin/run')
const asyn = require('async')

runners = [steam/*, origin*/]

const successLogging = () => console.log('\n\n\n Runner ended \n\n\n')
const errorLogging = reason => console.log(`\n\n\n Runner failed for reason: \n\n${reason}\n\n`)

asyn.map(runners, (runner) => {
    runner.run()
        .then(successLogging)
        .catch(errorLogging)
})