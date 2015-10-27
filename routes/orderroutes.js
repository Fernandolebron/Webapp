// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Order = require('../models/order');
var jwt = require('jsonwebtoken');

/**
    route middleware to verify a token
    @author Jose Reyes
*/
router.use(function(req, res, next) {
	console.log('using dish controller');
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {
	// verifies secret and checks exp
	jwt.verify(token, 'SecretKey', function(err, decoded) {      
	  if (err) {
	    return res.json({ success: false, message: 'Failed to authenticate token.' });    
	  } else {
	    // if everything is good, save to request for use in other routes
	    req.decoded = decoded;    
	    next();
	  }
	});
	
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
		    success: false, 
		    message: 'No token provided.' 
		});
	}
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/test', function(req, res) {
    res.json({ message: 'test' });   
});

module.exports = router;