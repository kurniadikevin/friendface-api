var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 /*  res.render('index', { title: 'Express' }); */
 res.redirect('/v1/api-docs');
});

module.exports = router;
