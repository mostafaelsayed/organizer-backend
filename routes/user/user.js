
const bcrypt = require('bcryptjs');
const User = require('../../models/user/user');
const router = require('express').Router();
const utils = require('../../utils');
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;

router.post('/login', function(req, res) {
    console.log('req body login : ', util.inspect(req.body, utilOptions));
    let inputEmail = req.body.email;
	let inputPassword = req.body.password;
	
	// find the user
	User.findOne({where: { email: inputEmail }}).then((userRecord) => {
		//const user = users[0];
		const user = userRecord.dataValues;
		const hash = userRecord.get('passwordHash');
		console.log("user result :", util.inspect(user, utilOptions));

		delete user['passwordHash'];

		bcrypt.compare(inputPassword, hash, function(err3, res2) {
			if (!err3 && res2 === true) {
				console.log("user found :", util.inspect(user, utilOptions));
				let jwt = utils.getToken(inputEmail);
				req.session.user = user;
				
				req.session.save((err) => {
					if (err) {
						console.log('user session not saved : ', err);
					}
				});
				console.log('after login user session : ', util.inspect(req.session.user, utilOptions));
				res.status(200).json({
					message: 'success',
					user: user,
					jwt: jwt
				});
			}
			else {
				console.log('error while logging user in : ', err3);
				res.status(404).json({
					message: 'login failed'
				});
			}
		});
	}).catch((err) => {
		console.log('error logging user in : ', util.inspect(err, utilOptions));
		res.json({message: 'login failed'}).status(404);
	});

});

router.get('/getUserInSession', function(req, res) {
	res.json({
		user: req.session.user
	});
});

router.post('/register', function(req, res) {
    console.log('req body register : ', util.inspect(req.body, utilOptions));
	let inputEmail = req.body.email;
	let inputFirstName = req.body.firstName;
	let inputLastName = req.body.lastName;
	let inputPassword = req.body.password;
	let inputPhoneNumber = req.body.phoneNumber;

	bcrypt.genSalt(10, function(err1, salt) {
		if (!err1) {
			bcrypt.hash(inputPassword, salt, function(err2, hash) {
				if (!err2) {
					// Create a new user
					User.create({ email: inputEmail, firstName: inputFirstName, lastName: inputLastName, phoneNumber: inputPhoneNumber, passwordHash: hash }).then((user) => {
						console.log("user's auto-generated ID:", user.id);
						res.status(200).json({
							message: 'success',
							email: inputEmail
						});
					}).catch((err) => {
						console.log('error creating user : ', util.inspect(err, utilOptions));
						res.json({message: 'signup failed'}).status(500);
					});
				}
				else {
					console.log('error hashing password : ', util.inspect(err2, utilOptions));
					res.json({message: 'signup failed'}).status(500);
				}
			});
		}
		else {
			console.log('error genSalt : ', util.inspect(err1, utilOptions));
			res.json({message: 'signup failed'}).status(500);
		}
	});
	
	

});

router.get('/logout', function(req, res) {
	req.session.user = undefined;

	res.send('success');
});


module.exports = router;