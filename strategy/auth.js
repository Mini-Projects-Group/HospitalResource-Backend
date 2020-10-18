const passport = require('passport');
const JWTExtract = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
const connection = require('../db/connection');
const util = require('util');
const jwt = require('jsonwebtoken');

const query = util.promisify(connection.query).bind(connection);

passport.use(
    new JWTStrategy({
        secretOrKey : process.env.JWT_SECRET,
        jwtFromRequest : JWTExtract.fromAuthHeaderAsBearerToken()
    }, async ( payload, done ) => {
        // SEARCH IN DATABASE
        // DECODE PAYLOAD
        let result;
        if(payload.type == 'hospital') {
            result = await query("SELECT * FROM hospital WHERE hospital_id=" + payload.hospital_id + ";");
        } else {
            result = await query("SELECT * FROM seller WHERE seller_id=" + payload.seller_id + ";");
        }
        if(result.length == 0)
            done(null,null);
        else done(null,result[0]);
    }))
