const MongoClient = require('mongodb').MongoClient;
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

exports.insertHistory = (data) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);

        data.forEach(element => {
            dbo.collection('history').findOne(element, function(err, res) {
                if (err) throw err;
                if (!res) {
                    exports.insert('history', element, (res) => {
                        console.log(res)
                    })
                }
                db.close();
            });
        });
    });
}