const express = require('express');
const router = express.Router();
const passport = require('passport');
const verifySeller = require('../verify/verifySeller');
const connection = require('../db/connection');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

router.post("/add",
            passport.authenticate('jwt', { session : false }),
            verifySeller,
            async(req,res)=>{
                const {item_name,quantity,unit_price} = req.body;
                let insertQuery;
                insertQuery = "INSERT INTO item VALUES(DEFAULT," + req.user.seller_id + ",'" + item_name + "'," + quantity+ "," + unit_price + ");";
                try{
                    connection.query(insertQuery,async (err , result) => {
                        if(err) res.status(400).json({"message" : "Error in adding Item","error" : true});
                        else res.status(200).json({"message":"Item Added Successfully","error":false});
                    });
                }catch(error){
                    return res.status(400).json({"message" : "Error","error" : true});
                }
            }
        );

module.exports = router;