const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const url = "mongodb://localhost:27017/hubihubi";
const dbName = 'hubihubi';

exports.insert = (collectionName, element, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).insert(element, function(err, res) {
          if (err) throw err;
          callback(res)
          db.close();
        });
    });
}

exports.findAll = (collectionName, query, sort, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).find(query).sort(sort).toArray(function(err, result) {
            if (err) throw err;
            callback(result)
            db.close();
        });
    });
}

exports.findOne = (collectionName, query, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).findOne(query, function(err, res) {
          if (err) throw err;
          callback(res)
          db.close();
        });
    });
}

exports.findLastBy = (collectionName, query, sort, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection('history').find(query).sort(sort).toArray(function(err, result) {
            if (err) throw err;
            callback(result[0])
            db.close();
        });
    });
}

exports.insertSteamHistory = (data, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);

        data.forEach(element => {
            dbo.collection('history').findOne(element, function(err, res) {
                if (err) throw err;
                if (!res) {
                    exports.insert('history', element, (res) => {})
                }
                db.close();
            });
        });
    });
}

exports.insertOriginHistory = (data) => {
    data.forEach(element => {
        exports.findLastBy('history', {game: ObjectId(element.game), currency: element.currency}, {timestamp: -1}, (lastHistory) => {
            if (!lastHistory) {
                exports.insert('history', element, (res) => {})
                return
            }

            let compare = JSON.parse(JSON.stringify(element));
            delete compare.timestamp
            delete lastHistory.timestamp
            delete lastHistory._id

            if (JSON.stringify(lastHistory) != JSON.stringify(compare)) {
                exports.insert('history', element, (res) => {})
            }
            db.close();
        })
    })
}