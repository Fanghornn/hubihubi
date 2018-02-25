var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'data': 'Hello World'}));
});

app.listen(3000);