require('dotenv').config();
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import { GoogleUser } from './passport';
import {
  UserData,
  addNewUser,
  isUserRegistered,
} from './controllers/UserController';

require('./passport.ts');

const app = express();
const PORT = 3001;
const key = fs.readFileSync('localhost-key.pem', 'utf-8');
const cert = fs.readFileSync('localhost.pem', 'utf-8');

const sessionSecret = process.env.SESSION_SECRET;

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [`https://localhost:3000`],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
  })
);

app.use(express.json());

function isLoggedIn(request: any, response: any, next: any) {
  if (request.user) {
    next();
  } else {
    response.sendStatus(401);
  }
}

app.get(
  '/api/v1/google/login',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'openid'],
  })
);

app.get('/api/v1/google/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while destroying session:', err);
    } else {
      req.logout(() => {
        res.redirect('https://localhost:3000');
      });
    }
  });
});

app.get('/api/v1/isAuthenticated', isLoggedIn, (req, res) =>
  res.sendStatus(200)
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
  }),
  async function (req, res) {
    if (req.user) {
      const googleUser = req.user as GoogleUser;

      const isRegistered = await isUserRegistered(googleUser);
      if (isRegistered) {        
        res.redirect('https://localhost:3000/dashboard');        
      } else {
        const queryParameters = new URLSearchParams({
          firstName: googleUser._json.given_name,
          lastName: googleUser._json.family_name,
          email: googleUser._json.email,
        });
        res.redirect(`https://localhost:3000/register?${queryParameters}`);
      }
    } else {
      res.redirect('/failed');
    }
  }
);

app.post('/api/v1/register', isLoggedIn, (req, res) => {
  const body: UserData = req.body;
  const googleUser: GoogleUser = req.user as GoogleUser;
  if (!body || !googleUser) {
    res.sendStatus(500);
    res.send('Unable to read data from body');
  } else {
    const isSuccess = addNewUser(googleUser, body);
    isSuccess ? res.sendStatus(200) : res.sendStatus(500);
  }
});

app.get('/api/v1/userinfo', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.send({ test: 'me' });
});

app.get('/failed', (req, res) => {
  console.log('User is not authenticated');
  res.send('Failed');
});

https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
