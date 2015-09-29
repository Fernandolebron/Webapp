// call the packages we need
var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/test', function(req, res) {
    res.json({ message: 'test' });   
});

module.exports = router;