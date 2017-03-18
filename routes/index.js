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

module.exports = router;
