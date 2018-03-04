const http = require('http')
const currency = require('../../utils/currency')
const db = require('./db.json')
const async = require('async')
const request = require('request')
const parser = require('./parser')
var fs = require('fs');
const handler = require('../../db/hander')

const fetch = (url, callback) => {
    const options = {
        url: url,
        json: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
        }
    };
    request(options, (err, res, body) => {
        callback(err, body)
    })
}


const baseUrl = 'https://steamdb.info/api/GetPriceHistory/'
Object.entries(db).forEach(element => {
    let gameRef = element[0]
    let gameUrls = element[1]

    let urls = []
    gameUrls.forEach(gameUrl => {
        let id = gameUrl.match(/\d+/)[0]
        
        if (gameUrl.indexOf('app') > -1) {
            currency.list().forEach(cc => {
                urls.push(baseUrl + '?appid=' + id + '&cc=' + cc)
            });
            return
        }

        if (gameUrl.indexOf('sub') > -1) {
            currency.list().forEach(cc => {
                urls.push(baseUrl + '?subid=' + id + '&cc=' + cc)
            });
            return
        }

        console.log(gameUrl + ' : malformed url')
    })

    async.map(urls, fetch, (err, res) => {
        if (err) return console.log(err);
        handler.findOne('game', {name: gameRef}, (game) => {
            console.log(game)
            if (!game) {
                console.error(gameRef + ' not found')
                return
            }
            
            let data = parser.parseAll(res[0].data, 'jp', game)
            handler.insertHistory(data)
        })
    })
});


