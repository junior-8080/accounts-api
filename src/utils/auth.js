const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;



const authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}

passport.use(new GoogleStrategy({
  clientID:    process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.AUTH_BASE_URL + '/auth/google/callback',
  passReqToCallback   : true
}, authUser));


passport.serializeUser((user, done) => { 
   // The USER object is the "authenticated user" from the done() in authUser function.
   // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.  
  done(null, user)
});

passport.deserializeUser((user, done) => {
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
  done (null, user)
}) 

module.exports = {passport}
