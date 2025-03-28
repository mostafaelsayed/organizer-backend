
//require('./globals');
const express = require('express');
const cors = require('cors');
const verifyToken = require('./utils').verifyToken;
const bodyParser = require('body-parser');
const userRouter = require('./routes/user/user');
const reservationRouter = require('./routes/reservation/reservation');
const app = express();
const expressSession = require('express-session');
const port = require('./config').port;

const session = expressSession({
	saveUninitialized: false,
	resave: false,
	secret: 'organizer-app'
});

// use express-session
app.use(session);

// enable cors for all origins

// why credentials and origin to get session to work ??
app.use(cors({credentials: true, origin: true}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use('/api/user', userRouter);

app.use('/api/reservation', verifyToken);

app.use('/api/reservation', reservationRouter);

app.get('/healthy', function(req, res) {
	res.status(200).send('Organizer is running');
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});