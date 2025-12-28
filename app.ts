import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { port } from './config';
import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './graphql/resolvers';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { expressMiddleware } from '@as-integrations/express5';
import { MyContext } from './models/my-context';

const localEnv = process.env.FRONTEND_ORIGIN?.startsWith('http://localhost');
const app = express();
const httpServer = http.createServer();
const typeDefs = readFileSync(path.join(__dirname, './graphql/schema.graphql'), 'utf-8');

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startGraphqlServer() {
  await server.start();
  const formattedDate = new Date().toISOString().slice(0, 23) + 'Z'; // Formats as "YYYY-MM-DDTHH:MM:SS.sssZ"
  console.log(`Server ready. Current time: ${formattedDate}`);
  startExpressApp();
}

function ensureLoggedIn(req: any) {
  if (!req.session.user) {
    console.error('not signed in');
    return false;
  }
  else {
    console.log('signed in');
    return true;
  }
}

function startExpressApp() {
  app.use((req, res, next) => {
    Object.defineProperty(req, 'secure', {
      configurable: true,
      enumerable: true,
      value: req.headers['forwarded']?.endsWith(';proto=https') && !localEnv
    });
    next();
  });
  app.use(
    session({
      saveUninitialized: false,
      resave: false,
      secret: 'organizer-app',
      cookie: {
        secure: !localEnv,
        sameSite: localEnv ? 'lax' : 'none',
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 1
      }
    })
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", String(process.env.FRONTEND_ORIGIN));
    res.setHeader("Access-Control-Allow-Methods", "POST,GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method == 'GET') {
      res.send(200);
      return;
    }
    if (req.method == 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    if (!req.body.query.includes('login') && !req.body.query.includes('register')) {
      if (ensureLoggedIn(req)) {
        next();
      }
      else {
        res.status(401).send();
      }
    }
    else {
      next();
    }
  })

  app.use(
    expressMiddleware(server, {
      context: async ({ req }) => ({ req: req }),
    }),
  )  

  app.get('/health', (req, res) => {
    res.status(200).send('Organizer is running');
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

startGraphqlServer();