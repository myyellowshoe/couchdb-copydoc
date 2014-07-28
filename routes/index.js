var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Copydoc' });
});
/* GET home page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello there folks!' });
});

module.exports = router;
