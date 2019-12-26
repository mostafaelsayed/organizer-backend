const jwt = require('jsonwebtoken');
const util = require('./config').util;
const utilOptions = require('./config').utilOptions;
const secret = require('./config').secret;


function getToken(email) {
	return jwt.sign({email: email}, secret, { expiresIn: 24*60*60 });
}

function verifyToken(req, res, next) {
	var token = req.headers['authorization'];
	console.log('req headers : ', util.inspect(req.headers, utilOptions));
	console.log('req url : ', util.inspect(req.url, utilOptions));

	if (req.method == 'POST') {
		console.log('req body : ', util.inspect(req.body, utilOptions));
	}

	if (req.url != '/api/register' && req.url != '/api/login') {
		if (token === req.session.jwt) {
			console.log('tokens are equal');
			jwt.verify(token, secret, function(err, decoded) {
				if (err) {
					console.log('Failed to authenticate token..');

					return res.status(403).send({
						// success: false,
						message: 'Failed to authenticate token'
					});
				}
				else {
					console.log('verified token : ', util.inspect(decoded, utilOptions));

					if (decoded && decoded.email) {
						return next();
					}
				}
			});
		}
		else {
			console.log('Failed to authenticate token..');

			return res.status(403).send({
				// success: false,
				message: 'Failed to authenticate token'
			});
		}
	}
	else {
		return next();
	}
}

module.exports = {
    getToken: getToken,
    verifyToken: verifyToken
};