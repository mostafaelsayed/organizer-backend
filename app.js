const express = require('express');
const port = process.env.PORT || 4000;
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/api').router;
const jwt = require("jsonwebtoken");
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

app.use('/api', router);








app.listen(port, function() {
    console.log(`Listening on port ${port}`);
})