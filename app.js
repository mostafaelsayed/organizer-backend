
const express = require('express');
const cors = require('cors');
const verifyToken = require('./utils').verifyToken;
const bodyParser = require('body-parser');
const userRouter = require('./routes/user/user');
const reservationRouter = require('./routes/reservation/reservation');
const app = express();
const errorResponses = require('./models/response/error');
const User = require('./database/models/index').User;
const util = require('./config').util;
const utilOptions = require('./config').utilOptions;

const port = require('./config').port;

// enable cors for all origins

// why credentials and origin to get session to work ??
app.use(cors({credentials: true, origin: true}));

require('./authentication/passport-facebook')(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use('/api/user', userRouter);

app.use('/api/reservation', verifyToken);

app.use('/api/reservation', reservationRouter);

app.get('/confirm_email', function(req, res) {
    let code = req.query.code;
    User.findOne({
        where: {
            email_verification_code: code
        }
    }).then((user) => {
        user.update({
            email_verified: true,
            email_verification_code: null
        }).then((success) => {
            console.log('success confirm email');            
            res.redirect(process.env.EMAIL_CONFIRMATION_SUCCESS_REDIRECT_URL || require('./secrets.json').EMAIL_CONFIRMATION_SUCCESS_REDIRECT_URL);
        }).catch((err) => {
            console.error('error update user when confirm email : ', util.inspect(err, utilOptions));
            return new errorResponses.InternalErrorResponse('confirm email').sendResponse(res);
        });
    }).catch((err) => {
        console.error('error find user when confirm email : ', util.inspect(err, utilOptions));
        return new errorResponses.InternalErrorResponse('confirm email').sendResponse(res);
    });
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});