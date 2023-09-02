require('dotenv').config();
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

export type GoogleUser = {
  _json: {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    email: string,
  }
}

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL, 
      tokenURL: process.env.GOOGLE_OAUTH_TOKEN_URL,  
      authorizationURL: process.env.GOOGLE_OAUTH_AUTH_URL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
