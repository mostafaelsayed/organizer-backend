import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import userRouter from './routes/user/user';
import reservationRouter from './routes/reservation/reservation';
import { verifyToken } from './utils';
import { port } from './config';

const app = express();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import path from 'path';
import { loginGraphql, registerUserGraphql } from './routes/user/user';
import User from './models/user/user';

// 1
const typeDefs = readFileSync(path.join(__dirname, './graphql/schema.graphql'), 'utf-8');

// 2
const resolvers = {
  Query: {
    user: async (parent: any, args: User) => {return await loginGraphql(args)}
  },
  Mutation: {
    registerUser: async (parent: any, args: User) => {
      return await registerUserGraphql(args);
    }
  }
}

// 3
const server = new ApolloServer({
  typeDefs,
  resolvers,
})



async function startGraphqlServer() {
  const { url } = await startStandaloneServer(server, {listen: {port: 5000}, context: async({req}) => {return {req: req}}});
  const formattedDate = new Date().toISOString().slice(0, 23) + 'Z'; // Formats as "YYYY-MM-DDTHH:MM:SS.sssZ"
  console.log(`Server ready at ${url}. Current time: ${formattedDate}`);
}


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

app.get('/health', (req, res) => {
  res.status(200).send('Organizer is running');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

startGraphqlServer();