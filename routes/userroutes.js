// Instancia del express
var express    = require('express');       
// Instancia del router de express
var router = express.Router();
// Instancia del módulo para encriptar la contraseña
var bcrypt = require('bcrypt-nodejs');
// Instancia del módulo encargado de generar los tokens para la autentificación
var jwt = require('jsonwebtoken');
// Instancia del módulo que genera un token aleatorio para resetear la contraseña
var crypto = require('crypto');
// Instancia del módulo encargado de enviar correos
var nodemailer = require('nodemailer'); 
// Referencia al modelo de usuarios
var User = require('../models/user');
// Link del cliente web del sistema
var webresetURL = 'https://abelinorest-gogims.c9.io/';

/**
    Verifica que el token mandado por el cliente es válido
    @author Jose Reyes
*/
router.post('/authenticate', function(req, res){
    User.models.user.find({ username: req.body.username}, function(err, user){
        if (err) 
        	throw err;
    
        if (user.length == 0 || !bcrypt.compareSync(req.body.password, user[0].password)) {
          res.json({ success: false, message: 'Authentication failed.' });
        }
        else {
          var token = jwt.sign(user[0], 'SecretKey', {
              expiresIn: 86400 // expires in 24 hours
            });
    
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              user:  user[0]
            });
        }
    });
});

/**
    Envía un correo con el link para resetear su usuario
    @author Jose Reyes
*/
router.post('/forgotpassword', function(req, res){
    User.models.user.find({ email: req.body.email}, function(err, user){
        if (err) 
        	throw err;
    
        if (user.length == 0) {
          res.json({ success: false, message: '¡Usuario no existe!' });
        }
        else {
          crypto.randomBytes(48, function(ex, buf) {
            var tokenpassword = buf.toString('hex');
            user[0].passwordReset = tokenpassword;
            
            user[0].save(function(err){
        			if (err) {
        				res.send(err);
        			};
        			
        			// create reusable transporter object using SMTP transport
              var transporter = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                      user: 'abelinorestaurante@gmail.com',
                      pass: 'abelinorestaurante123'
                  }
              });
              
              var resetlink = webresetURL + tokenpassword;
              
              // setup e-mail data with unicode symbols
              var mailOptions = {
                  from: 'Abelino Restuarante <abelinorestaurante@gmail.com>', // sender address
                  to: user[0].email, // list of receivers
                  subject: 'Abelino Restuarante: Reset Passoword', // Subject line
                  text: 'Para resetear su contraseña utilizar este link:' + resetlink, // plaintext body
                  html: 'Para resetear su contraseña utilizar este <a href="' + resetlink + '">link</a>' // html body
              };
              
              // send mail with defined transport object
              transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                      return console.log(error);
                  }
                  console.log('Message sent: ' + info.response);
                  res.json({success: true});
              
              });
        		});
          });
        }
      });
});

/**
    Confirma que el token para resetear la contraseña es válido
    @author Jose Reyes
*/
router.get('/reset/:token', function(req, res){
  User.models.user.find({passwordReset: req.params.token},function(err, user){
			if(err) 
				return res.send(err);

			if (user.length > 0) {
			  res.json({success: true, user: user[0]});
			}
			
			  res.json({success: false});
		});
});

/**
    Actualizar la contraseña
    @author Jose Reyes
*/
router.put('/editpassword/:id', function(req, res){
	console.log('asking for -> ' + req.params.id);
		User.models.user.get(req.params.id, function(err, user){
			if(err) 
				return res.send(err);

			user.password = bcrypt.hashSync(req.body.password);
			
			user.save(function(err){
  			if (err) {
  				res.send(err);
  			};
  
  			res.json({message: '¡Contraseña actualizada!'});
  		});
		});
	});
	
/**
    Crea un usuario nuevo
    @author Jose Reyes
*/
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

/**
    route middleware to verify a token
    @author Jose Reyes
*/
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

/**
    Devuelve a un usuario del sistema
    @author Jose Reyes
*/
router.get('/get/:id', function(req, res){
		User.models.user.get(req.params.id, function(err, user){
			if(err) 
				return res.send(err);

			res.json(user);
		});
	});

/**
    Devuelve todos los usuarios del sistema
    @author Jose Reyes
*/
router.get('/getall', function(req, res){
		User.models.user.find(function(err, users){
			if(err) 
				return res.send(err);

			res.json(users);
		});
	});
	
	
module.exports = router;