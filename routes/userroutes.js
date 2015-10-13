
// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('json-web-token');

router.post('/authenticate', function(req, res){
    
    User.models.user.find({ username: req.body.username}, function(err, user){
        if (err) 
        	throw err;
    
        if (user.length == 0 || !bcrypt.compareSync(req.body.password, user[0].password)) {
          res.json({ success: false, message: 'Authentication failed.' });
        }
        else {
          var token = jwt.sign(user, 'SecretKey', {
              expiresInMinutes: 1440 // expires in 24 hours
            });
    
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
        }
    });
});

//	Retornar un usuario en específico
router.get('/one/:id', function(req, res){
  console.log('using show dish');
	console.log('asking for -> ' + req.params.id);
		User.models.user.get(req.params.id, function(err, user){
			if(err) 
				return res.send(err);

			res.json(user);
		});
	});

// route middleware to verify a token
router.use(function(req, res, next) {

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
});


router.post('/create', function(req, res){
		var user = new User.models.user();

		user.username	= req.body.username;
		user.name		= req.body.name;
		user.lastname	= req.body.lastname;
		user.email		= req.body.email;
		user.password	= bcrypt.hashSync(req.body.password);
		user.isAdmin	= req.body.isAdmin;

		user.save(function(err){
			if (err) {
				res.send(err);
			};

			res.json({message: '¡Usuario creado!'});
		});
	});

router.get('/getall', function(req, res){
		User.models.user.find(function(err, users){
			if(err) 
				return res.send(err);

			res.json(users);
		});
	});
	
	
module.exports = router;