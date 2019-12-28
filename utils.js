const jwt = require('jsonwebtoken');
const util = require('./config').util;
const utilOptions = require('./config').utilOptions;
const secret = require('./config').secret;
const NotAuthenticatedResponse = require('./models/response/error').NotAuthenticatedResponse;

function getToken(email, id) {
	return jwt.sign({email, id}, secret, { expiresIn: 24*60*60 });
}

function verifyToken(req, res, next) {
	var token = req.headers['authorization'];
	console.log('req headers : ', util.inspect(req.headers, utilOptions));
	console.log('req url : ', util.inspect(req.url, utilOptions));

	if (req.method == 'POST') {
		console.log('req body : ', util.inspect(req.body, utilOptions));
	}

	if (req.url != '/api/register' && req.url != '/api/login') {
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				console.log('Failed to authenticate token..');
				return new NotAuthenticatedResponse('verify token').sendResponse(res);
			}
			else {
				console.log('token is verified : ', util.inspect(decoded, utilOptions));

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

module.exports = {
    getToken,
    verifyToken
};