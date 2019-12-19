const jwt = require('jsonwebtoken');


function getToken(email) {
	return new Promise((resolve) => {
		resolve(jwt.sign({email: email}, '987fdgo1z09qjla0934lksdp0', { expiresIn: 24*60*60 }));
	});
}

function verifyToken(req, res, next) {
	if (req.url != '/api/register' && req.url != 'api/login') {
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
				if (decoded && decoded.user.email) {
					// Set user UID in the request
					// In a real application the user profile should be retrieved from the persistent storage here
					// req.user = {
					// 	email: decoded.email
					// };
					if (!req.session.user) {
						req.session.user = decoded.user;
					}

					req.session.user = decoded.user;

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
    getToken: getToken,
    verifyToken: verifyToken
};