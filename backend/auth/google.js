const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const prisma = require('../lib/prisma');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : `http://localhost:${process.env.PORT || 5000}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists, if not create new user
    const user = await prisma.user.upsert({
      where: { email: profile.emails[0].value },
      update: {
        name: profile.displayName,
        avatar: profile.photos[0].value,
      },
      create: {
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
      }
    });
    
    return done(null, user);
  } catch (error) {
    console.error('Error in Google OAuth strategy:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id },
      select: { id: true, email: true, name: true, avatar: true }
    });
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

module.exports = passport;
