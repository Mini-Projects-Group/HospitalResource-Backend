const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

// PROTECTED ROUTE
router.get( '/hidden',
    passport.authenticate('jwt', { session : false }),
    async ( req , res ) => {
    res.send("Hidden Secret !!! " + " Name : " + req.user.name);
});

// SIGNUP USER
router.post( '/signup' , async ( req , res ) => {
    return res.json({"message" : "Signed Up","error" : null})
});

// LOGIN USER
router.post( '/login' , async ( req , res ) => {
    return res.json({"message" : "Logged In","error" : null})
});


module.exports = router;

