import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import userRouter from './routes/user/user';
import reservationRouter from './routes/reservation/reservation';
import { verifyToken } from './utils';
import { port } from './config';

const app = express();

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: 'organizer-app',
  })
);

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user', userRouter);
app.use('/api/reservation', verifyToken, reservationRouter);

app.get('/healthy', (req, res) => {
  res.status(200).send('Organizer is running');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});