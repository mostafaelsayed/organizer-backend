
require('./globals');
const express = require('express');
const cors = require('cors');
const verifyToken = require('./utils').verifyToken;
const bodyParser = require('body-parser');
const userRouter = require('./routes/user/user');
const app = express();
const expressSession = require('express-session');

// enable cors for all origins
app.use(cors());

// use express-session
app.use(expressSession({
	saveUninitialized: true,
	resave: true,
	secret: 'organizer-app'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use('/api/user', userRouter);

app.use('/api/reservation', verifyToken);

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});