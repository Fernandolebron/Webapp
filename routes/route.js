// call the packages we need
var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our rest video api!' });  
});


router.route('/videos')
  .post(function(req, res) {
    res.json({ message: 'Video criado!' });
  })
  .get(function(req, res) {
    res.json({ message: 'Video criado!' });
  });

//last line - try this
module.exports = router;