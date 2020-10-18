const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db/connection');


// PROTECTED ROUTE
router.get( '/hidden',
    passport.authenticate('jwt', { session : false }),
    async ( req , res ) => {
    res.send("Hidden Secret !!! " + " Name : " + req.user.name);
});

// SIGNUP USER
router.post('/signup', async (req,res) => {
    // GET THE USER INFO
    let insertQuery;
    let encryptedPassword = bcrypt.hashSync(req.body.password,10);
    if( req.body.type == "hospital") {
        insertQuery = "INSERT INTO hospital VALUES(NULL,'" + req.body.hospital_name + "','" + req.body.email_id + "','" + encryptedPassword+ "','" + req.body.address + "'," + req.body.contact_no + ");";
    } else {
        insertQuery = "INSERT INTO seller VALUES(NULL,'" + req.body.shop_name + "','" + req.body.seller_name + "','" + req.body.email_id + "','" + encryptedPassword + "','" + req.body.address + "'," + req.body.contact_no + ");";
    }
    try {
        let type  = req.body.type;
        connection.query(insertQuery,async (err , result) => {
            if(err) return res.json({"message" : "Duplicate Email","error" : true})

            let id = result.insertId;
            if(type == "hospital") {
                connection.query("SELECT * FROM " + type + " WHERE hospital_id='" + id + "';",(err,row,fields) => {
                    let token = jwt.sign(JSON.stringify(row[0]),process.env.JWT_SECRET);
                    return res.json({"message" : "Signed Up Hospital","error" : null,"token":token})
                });
            } else {
                // connection.query();
                connection.query("SELECT * FROM " + type + " WHERE seller_id='" + id + "';",(err,row,fields) => {
                    let token = jwt.sign(JSON.stringify(row[0]),process.env.JWT_SECRET);
                    return res.json({"message" : "Signed Up Seller","error" : null,"token":token})
                });
            }
        });
    } catch(e) {
        console.log("Error Occured While inserting user " );
        return res.json({"message" : "Error","error" : true})
    }
    
});

// LOGIN USER
router.post( '/login' , async ( req , res ) => {
    return res.json({"message" : "Logged In","error" : null})
});


module.exports = router;

