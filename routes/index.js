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

router.get('/:protocol//:url', function (req, res) {
    var db = req.db;
    var protocol = req.params.protocol;
    var url = req.params.url;
    if (protocol !== 'http:' && protocol !== 'https:') {
      res.end('Invalid protocol in url');
    } else {
      
      var createData = {
          "url": protocol + url,
          "urlNum": getRandomNumber(1000, 9999)
      };
      var collection = db.get('urlcollection');
      collection.insert(createData, (err, doc) => {
          if (err) {
              res.send("there was a problem saving the url in the database");
          } else {
              //res.send(doc);
              res.render('all', {'urls': [createData]});
          }
      });
    }
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
