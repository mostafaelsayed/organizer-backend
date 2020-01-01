const jwt = require('jsonwebtoken');
const util = require('./config').util;
const utilOptions = require('./config').utilOptions;
const secret = require('./config').secret;
const NotAuthenticatedResponse = require('./models/response/error').NotAuthenticatedResponse;
const InternalErrorResponse = require('./models/response/error').InternalErrorResponse;

function getToken(email, id) {
	return jwt.sign({email, id}, secret, { expiresIn: 24*60*60 });
}

function verifyToken(req, res, next) {
	var token = req.headers['authorization'];
	console.log('req headers : ', util.inspect(req.headers, utilOptions));
	console.log('req url : ', util.inspect(req.url, utilOptions));
	console.log('jwt token : ', util.inspect(token, utilOptions));

	if (req.method == 'POST') {
		console.log('req body : ', util.inspect(req.body, utilOptions));
	}

	// if user did not send jwt token then check if logged in with facebook
	if (token === undefined || token === 'facebook_token') {
		return verifyFacebookToken(req, res, next);
	}

	if (req.url != '/api/register' && req.url != '/api/login' && req.url != '/login/facebook') {
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				console.log('Failed to authenticate jwt token');
				return new NotAuthenticatedResponse('verify jwt token').sendResponse(res);
			}
			else {
				console.log('jwt token is verified : ', util.inspect(decoded, utilOptions));

				if (decoded && decoded.email) {
					res.locals.user = decoded; // store the user that made the request in the res locals
					return next();
				}
			}
		});
	}
	else {
		return next();
	}
}

function verifyFacebookToken(req, res, next) {
	console.log('verifing facebook token and req.user is : ', util.inspect(req.user, utilOptions));

	if (req.user) {
		console.log('facebook token is verified');
		return next();
	}
	else {
		console.log('Failed to authenticate facebook access token token');
		return new NotAuthenticatedResponse('verify facebook access token').sendResponse(res);
	}
}

function getUserInfo(req, res) {
	// if user logged in with facebook
	if (req.user) {
		return req.user;
	}

	// if user logged in with basic authentication (jwt token)
	else if (res.locals.user) {
		return res.locals.user;
	}
	else {
		return new InternalErrorResponse('getting user info').sendResponse(res);
	}
}
module.exports = {
    getToken,
	verifyToken,
	verifyFacebookToken,
	getUserInfo
};