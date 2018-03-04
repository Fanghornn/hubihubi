var express = require('express');
var bodyParser = require('body-parser');
const handler = require('../db/hander')
const csv = require('express-csv')
const ObjectId = require('mongodb').ObjectId; 
var app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : false }));


app.get('/', function(req, res) {
    res.render('index')
});

app.post('/export', function(req, res) {
    let headers = ['title', 'timestamp', 'EUR', 'USD', 'jp'];
    let data = []
    data.push(headers)
    try {
        handler.findAll('game', {}, {}, (games) => {
            let countHistory = 0;
            games.forEach(game => {
                let input = {
                    'title': game.name,
                    'timestamp': null,
                    'EUR': null,
                    'USD': null,
                    'jp': null
                }
                handler.findAll('history', {game: ObjectId(game._id)}, {timestamp: -1}, (history) => {
                    history.forEach(element => {
                        if (!input[element.currency]) {
                            input[element.currency] = element.initialPrice
                            input.timestamp =element.timestamp
                        }
                    });
                    data.push(input)

                    countHistory += 1
                    if (countHistory == games.length) {
                        res.csv(data)
                    }
                })
            })
        })
    } catch(err) {
        res.send(err)
    }

})

app.listen(3000);