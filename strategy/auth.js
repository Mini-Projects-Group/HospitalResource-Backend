const passport = require('passport');
const JWTExtract = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;

passport.use(
    new JWTStrategy({
        secretOrKey : process.env.JWT_SECRET,
        jwtFromRequest : JWTExtract.fromAuthHeaderAsBearerToken()
    }, async ( payload, done ) => {
        // SEARCH IN DATABASE

        done(null,payload);
    }))
