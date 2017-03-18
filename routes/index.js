var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/all', function (req, res) {
    var db = req.db;
    var collection = db.get('urlcollection');
    collection.find({},{},function(err,docs){
        if (err) {
            res.render('error', {'error': err});
        } else {
            res.render('all', {'urls': docs});
        }
    });
});

router.delete('/quotes', function (req, res) {
    var db = req.db;
    var id = req.body.id;
    
    
});

router.get('/:protocol//:url', function (req, res) {
    var db = req.db;
    var protocol = req.params.protocol;
    var url = req.params.url;
    if (protocol !== 'http:' && protocol !== 'https:') {
      res.end('Invalid protocol in url');
    } else {
      
        var collection = db.get('urlcollection');
        var createData = {
            "url": protocol + '//' + url,
            "urlNum": String(getRandomNumber(1000, 9999))
        };
        collection.findOneAndDelete(
            { 'urlNum': createData.urlNum },
            function (err, result) {
                if (err)
                    res.render('error', {'error':'invalid url'});
                collection.insert(createData, function (err, doc) {
                    if (err)
                        res.send("there was a problem saving the url in the database");
                    else
                        res.render('all', {'urls': [createData]});
                });
            }
        );
    }
});

router.get('/:newUrl', function (req, res) {
    var newUrl = req.params.newUrl;
    if (isNaN(newUrl)) {
        res.render('error', {'error':'invalid url'});
    } else {
        var db = req.db;
        var collection = db.get('urlcollection');
        collection.find({
            'urlNum': newUrl
        },{},function(err,docs){
            if (err) {
                res.end("The url you entered wasn't created with this app.");
            } else {
                res.redirect(docs[0].url);
            }
        });
    }
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
