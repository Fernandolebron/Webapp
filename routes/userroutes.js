
// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

router.post('/authenticate', function(req, res){
    
    User.models.user.find({ username: req.body.username}, function(err, user){
        if (err) 
        	throw err;
        	
        	var hash = bcrypt.hashSync("12345678");
    
        if (user.length == 0 || !bcrypt.compareSync(user[0].password), hash) {
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




router.post('/test', function(req, res){
		var user = new User.models.user();
		
		bcrypt.hash(req.body.password, null, null, function(err, hash) {
		    user.username	= req.body.username;
			user.name		= req.body.name;
			user.lastname	= req.body.lastname;
			user.email		= req.body.email;
			user.password	= hash;
			user.isAdmin	= req.body.isAdmin;
	
			user.save(function(err){
				if (err)
					res.send(err);
	
				res.json({message: 'Usuario creado!'});
			});
		});
	})

.get('/test', function(req, res){
		User.models.user.find(function(err, users){
			if(err) 
				return res.send(err);

			res.json(users[0].username);
		});
	});
	
	
module.exports = router;