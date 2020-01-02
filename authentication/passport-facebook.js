const User = require('../models/user/user');
const util = require('../config').util;
const utilOptions = require('../config').utilOptions;
const errorResponses = require('../models/response/error');
const expressSession = require('express-session');
// --- authenticate using facebook login --- //
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const clientId = process.env.FACEBOOK_CLIENT_ID ? process.env.FACEBOOK_CLIENT_ID : require('../secrets.json')['FACEBOOK_CLIENT_ID'];
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET ? process.env.FACEBOOK_CLIENT_SECRET : require('../secrets.json')['FACEBOOK_CLIENT_SECRET'];
const redirectUrl = process.env.FACEBOOK_REDIRECT_URL ? process.env.FACEBOOK_REDIRECT_URL : 'http://localhost:4000/return/facebook';
const facebook_success_url = process.env.FACEBOOK_SUCCESS_URL ? process.env.FACEBOOK_SUCCESS_URL : 'http://localhost:3000/success_login';

// pass app object to enable facebook authentication for the app
module.exports = function(app) {
    passport.use(new FacebookStrategy({
        clientID: clientId,
        clientSecret,
        callbackURL: '/return/facebook',
        profileFields: ['id', 'email', 'displayName', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('getting facebook user profile and tokens');
        //console.log('facebook accessToken : ', accessToken);
        //console.log('facebook refreshToken : ', refreshToken);
        console.log('facebook profile : ', util.inspect(profile, utilOptions));
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.

        User.findOne({
            where: {
                facebook_id: profile.id
            }
        }).then((user) => {
            console.log('success find user when login with facebook');
            if (user && user.dataValues && user.dataValues.id) {
                user.update({facebook_access_token: accessToken}).then((success) => {
                    console.log('success update user access token when login with facebook');
                    return cb(null, profile);
                }).catch((errorUpdate) => {
                    console.log('error update user access token when login with facebook : ', util.inspect(errorUpdate, utilOptions));
                    return cb('error facebook login');
                });
            }
            else {
                User.create({
                    firstName: profile.name.givenName,
                    lastName: profile.name.middleName,
                    email: profile.username,
                    facebook_id: profile.id,
                    facebook_access_token: accessToken
                }).then((successCreate) => {
                    console.log('success create user when login with facebook');
                    return cb(null, profile);
                }).catch((errorCreate) => {
                    console.log('error create user when login with facebook : ', util.inspect(errorCreate, utilOptions));
                    return cb('error facebook login');
                });
            }
        }).catch((errorFind) => {
            console.log('error find user when login with facebook : ', util.inspect(errorFind, utilOptions));
            return cb('error facebook login');
        });

        // return cb(null, profile);
    })
    );

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  In a
    // production-quality application, this would typically be as simple as
    // supplying the user ID when serializing, and querying the user record by ID
    // from the database when deserializing.  However, due to the fact that this
    // example does not have a database, the complete Facebook profile is serialized
    // and deserialized.
    passport.serializeUser(function(user, cb) {
        console.log('facebook user when serialize : ', util.inspect(user, utilOptions));
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        console.log('facebook user id when deserialize : ', util.inspect(id, utilOptions));

        User.findOne({where: {facebook_id: id}}).then((success) => {
            console.log('success get facebook user when deserialize : ', util.inspect(success.dataValues, utilOptions));
            cb(null, success.dataValues);
        }).catch((err) => {
            console.log('error get facebook user when deserialize : ', util.inspect(err, utilOptions));
            cb('error authenticate facebook user');
        });
    });

    const session = expressSession({
        saveUninitialized: true,
        resave: true,
        secret: 'organizer-app'
    });

    // use express-session
    app.use(session);


    // Initialize Passport and restore authentication state, if any, from the
    // session.
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login/facebook', function(req, res) {
        console.log('inside login/facebook');
        res.send(`https://www.facebook.com/v3.2/dialog/oauth?response_type=code&redirect_uri=${redirectUrl}&client_id=${clientId}`);
    });

    app.get('/login_fail/facebook', function(req, res) {
        console.log('inside login_fail/facebook');
        return new errorResponses.InternalErrorResponse('facebook login').sendResponse(res);
    });

    app.get('/return/facebook', passport.authenticate('facebook', { failureRedirect: '/login_fail/facebook' }), function(req, res) {
        console.log('inside return/facebook');
        res.redirect(`${facebook_success_url}`);
    });
};