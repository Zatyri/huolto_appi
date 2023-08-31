require('dotenv').config()
import express from 'express';
import passport from "passport";
import session from "express-session";
import cors from "cors";
import fs from "fs";
import https from "https"

require("./passport.ts")

const app = express()
const PORT = 3001
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const sessionSecret = process.env.SESSION_SECRET

app.use(session({
  secret: sessionSecret,  
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [`http://localhost:3000`],
    methods: "GET,POST,PUT,DELETE,OPTIONS"
  })
);

function isLoggedIn(request:any, response:any, next:any) {
  if (request.user) {
    next();
  } else {
    response.sendStatus(401);
  }
}

app.get('/api/v1/google', 
  passport.authenticate('google', {
    scope:
    ['email', 'profile']
  }, 

  ));

app.get('/auth/google/callback',
passport.authenticate('google', {
  failureRedirect: '/failed',
}),
function (req, res) {
  console.log(req)
  res.redirect("https://localhost:3000/dashboard")
}
);

app.get("/failed", (req, res) => {
  console.log('User is not authenticated');
  res.send("Failed")
})


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while destroying session:', err);
    } else {
      req.logout(() => {
        console.log('You are logged out');
        res.redirect('/home');
      });
    }
  });
});

https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`)
});