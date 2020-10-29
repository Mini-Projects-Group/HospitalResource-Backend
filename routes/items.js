const express = require('express');
const router = express.Router();
const passport = require('passport');
const verifySeller = require('../verify/verifySeller');
router.post("/add",
            passport.authenticate('jwt', { session : false }),
            verifySeller,
            async(req,res)=>{
                 res.send(req.user);  
            }
        );

module.exports = router;