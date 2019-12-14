
const router = require('express').Router();
const util = require('util');
const User = require('../models/user.js').User;
const bcrypt = require('bcryptjs');
const utilOptions = {depth: null};

router.post('/login', function(req, res) {
    console.log('req body login : ', util.inspect(req.body, utilOptions));
    let inputEmail = req.body.email;
	let inputPassword = req.body.password;
	
	

});

router.post('/register', function(req, res) {
    console.log('req body register : ', util.inspect(req.body, utilOptions));
	let inputEmail = req.body.email;
	let inputFirstName = req.body.firstName;
	let inputLastName = req.body.lastName;
	let inputPassword = req.body.password;

	bcrypt.genSalt(10, function(err1, salt) {
		if (!err1) {
			bcrypt.hash(inputPassword, salt, function(err2, hash) {
				if (!err2) {
					// Create a new user
					User.create({ email: inputEmail, firstName: inputFirstName, lastName: inputLastName, passwordHash: hash }).then((user) => {
						console.log("user's auto-generated ID:", user.id);
						res.status(200).json({
							message: 'success',
							email: inputEmail
						});
					}).catch((err) => {
						console.log('error creating user : ', util.inspect(err, {depth: null}));
						res.json({message: 'signup failed'});
					});
				}
				else {
					console.log('error hashing password : ', util.inspect(err2, utilOptions));
					res.json({message: 'signup failed'});
				}
			});
		}
		else {
			console.log('error genSalt : ', util.inspect(err1, utilOptions));
			res.json({message: 'signup failed'});
		}
	});
	
	

});


router.get('/getToken', function(req, res) {
    if (req.session.user) {
        // Generate JWT - set expire to 1 day
        res.json({success: true,
            token: jwt.sign({email:req.session.user.email}, '987fdgo1z09qjla0934lksdp0', {expiresIn: 24*60*60 })
        });
    }
    else {
        res.json({token: null});
    }
});


router.get('/verifyToken', function(req, res) {
    jwt.verify(token, '987fdgo1z09qjla0934lksdp0', function(err, decoded) {
		if (err) {
			console.log('Failed to authenticate token..');

			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token....'
			});
		}
		else {
			console.log('verified token : ', util.inspect(decoded, utilOptions));
			if (decoded && decoded.email) {
				// Set user UID in the request
				// In a real application the user profile should be retrieved from the persistent storage here
				// req.user = {
				// 	email: decoded.email
				// };
				if (!req.session.user) {
					req.session.user = {};
				}

				req.session.user.email = decoded.email;

				return next();
			}
		}
    });
});


exports.router = router;