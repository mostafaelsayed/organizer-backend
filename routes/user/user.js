
const bcrypt = require('bcryptjs');
const User = require('../../models/user/user');
const router = require('express').Router();
const utils = require('../../utils');
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;
const errorResponses = require('../../models/response/error');
const SuccessResponse = require('../../models/response/success');

router.post('/login', function(req, res) {
    console.log('req body login : ', util.inspect(req.body, utilOptions));
    let inputEmail = req.body.email;
	let inputPassword = req.body.password;
	
	// find the user
	User.findOne({where: { email: inputEmail }}).then((userRecord) => {
		console.log("user record :", util.inspect(userRecord, utilOptions));
		const user = userRecord.dataValues;
		const hash = userRecord.get('passwordHash');
		console.log("user result :", util.inspect(user, utilOptions));

		delete user['passwordHash'];

		bcrypt.compare(inputPassword, hash, function(err3, res2) {
			if (!err3 && res2 === true) {
				console.log("user found :", util.inspect(user, utilOptions));

				let jwt = utils.getToken(inputEmail);
				req.session.user = user;
				req.session.jwt = jwt;
				
				req.session.save((err) => {
					if (err) {
						console.log('user session not saved : ', err);
					}
				});

				console.log('after login user session : ', util.inspect(req.session.user, utilOptions));
				new SuccessResponse('login', {user, jwt}).sendResponse(res);
			}
			else {
				console.log('error compare password when log user in : ', err3);
				new errorResponses.NotAuthenticated('login').sendResponse(res);
			}
		});
	}).catch((err) => {
		console.log('error finding email when log user in : ', util.inspect(err, utilOptions));
		new errorResponses.NotAuthenticated('login').sendResponse(res);
	});

});

router.get('/getUserInSession', function(req, res) {
	new SuccessResponse('getting user session', {user: req.session.user}).sendResponse(res);
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
						console.log("success register user : ", util.inspect(user, utilOptions));
						new SuccessResponse('register', {email: inputEmail}).sendResponse(res);
						
					}).catch((err) => {
						console.log('error register user : ', util.inspect(err, utilOptions));
						new errorResponses.InternalError('register').sendResponse(res);
					});
				}
				else {
					console.log('error hashing password : ', util.inspect(err2, utilOptions));
					new errorResponses.InternalError('register').sendResponse(res);
				}
			});
		}
		else {
			console.log('error genSalt : ', util.inspect(err1, utilOptions));
			new errorResponses.InternalError('registering user').sendResponse(res);
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.user = undefined;
	req.session.jwt = undefined;

	new SuccessResponse('logout').sendResponse(res);
});

module.exports = router;