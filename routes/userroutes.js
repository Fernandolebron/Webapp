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
var webresetURL = 'http://192.241.167.243:1337/resetPassword/';

/**
    Verifica que el token mandado por el cliente es válido
    @author Jose Reyes
*/
router.post('/authenticate', function(req, res){
    console.log('authenticating user ' + req.body.username);
    
    User.findOne({ where: { username: req.body.username}}).then(function(user){
        if (user == null || !bcrypt.compareSync(req.body.password, user.password)) {
          res.json({ success: false, message: 'Authentication failed.' });
        }
        else {
          var token = jwt.sign(user, 'SecretKey', {
              expiresIn: 86400 // expires in 24 hours
            });
            
            console.log('Autenficiado el usuario ' + user.username );
    
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              user:  user
            });
        }
    });
});

/**
    Envía un correo con el link para resetear su usuario
    @author Jose Reyes
*/
router.post('/forgotpassword', function(req, res){
    console.log('asking for reset password ' + req.body.email);
    
    User.findOne({ where: { email: req.body.email}}).then(function(user){
        if (user == null) {
          res.json({ success: false, message: '¡Usuario no existe!' });
        }
        else {
          crypto.randomBytes(48, function(ex, buf) {
            var tokenpassword = buf.toString('hex');
            user.passwordReset = tokenpassword;
            
            user.save().then(function(){
        			// create reusable transporter object using SMTP transport
              var transporter = nodemailer.createTransport("SMTP",{
                  service: 'Gmail',
                  auth: {
                      user: 'abelinorestauranteRD@gmail.com',
                      pass: 'abelinorestaurante123'
                  }
              });
              
              var resetlink = webresetURL + tokenpassword;
              
              // setup e-mail data with unicode symbols
              var mailOptions = {
                  from: 'Abelino Restuarante <abelinorestaurante@gmail.com>', // sender address
                  to: user.email, // list of receivers
                  subject: 'Abelino Restuarante: Reset Passoword', // Subject line
                  text: 'Para resetear su contraseña utilizar este link: ' + resetlink, // plaintext body
                  html: 'Para resetear su contraseña utilizar este <a href="' + resetlink + '">link</a>' // html body
              };
              
              // send mail with defined transport object
              transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                      console.log(error);
                      return;
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
  console.log('reseting password of user #' + req.params.id);
  
  User.findOne({where: {passwordReset: req.params.token}}).then(function(user){
			if (user != null) {
			  res.json({success: true, user: user});
			}
			
			  res.json({success: false});
		});
});

/**
    Actualizar la contraseña
    @author Jose Reyes
*/
router.put('/editpassword/:id', function(req, res){
	  console.log('editing password of user #' + req.params.id);
	
		User.findById(req.params.id).then(function(user){
			user.password = bcrypt.hashSync(req.body.password);
			
			user.save().then(function(){
  			res.json({message: '¡Contraseña actualizada!'});
  		});
		});
	});
	
/**
    Crea un usuario nuevo
    @author Jose Reyes
*/
router.post('/create', function(req, res){
    console.log('creating user');
    
		User.create({
  		username	: req.body.username,
  		name		: req.body.name,
  		lastname	: req.body.lastname,
  		email		: req.body.email,
  		password	: bcrypt.hashSync(req.body.password),
  		isAdmin	: req.body.isAdmin
		}).then(function(user){
		  res.json({message: '¡Usuario creado!', user: user});
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
        res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    res.status(403).send({ 
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
    console.log('returning user #' + req.params.id );
    
		User.findById(req.params.id).then(function(user){
			res.json(user);
		});
	});

/**
    Devuelve todos los usuarios del sistema
    @author Jose Reyes
*/
router.get('/getall', function(req, res){
    console.log('returning all users');
  
		User.findAll().then(function(users){
			res.json(users);
		});
	});
	
/**
    Actualiza un usuario
    @author Jose Reyes
*/
router.put('/edit/:id', function(req, res){
    console.log('editing user #' + req.params.id);
    
		User.findById(req.params.id).then(function(user){
				user.name = req.body.name;
				user.lastname = req.body.lastname;
				user.email = req.body.email;
				user.password = bcrypt.hashSync(req.body.password);
				user.isAdmin = req.body.isAdmin;
				user.passwordReset = req.body.passwordReset;
				
				user.save().then(function(user){
    			res.json({message: '¡Usuario editado!', user: user});
  		});
  		
		});
	});
	
	
module.exports = router;