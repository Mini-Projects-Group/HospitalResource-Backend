const express = require('express');
const router = express.Router();
const passport = require('passport');
const connection = require('../db/connection');
const util = require('util');

const verifySeller = require('../verify/verifySeller');
const verifyItemSeller = require('../verify/verifyItemSeller');

const query = util.promisify(connection.query).bind(connection);

//ADD ITEM
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
  
        
//DELETE ITEM
router.delete("/delete", 
                passport.authenticate('jwt', { session : false }),
                verifySeller,
                verifyItemSeller,
                async(req,res)=>{
                    try{
                        let deleteQuery= "DELETE FROM item WHERE item_id =" + req.body.item_id + ";";
                        connection.query(deleteQuery, async (err, result) => {
                            if (err) res.status(400).json({"message" : "Error in deleting Item","error" : true});
                            else res.status(200).json({"message":"Item Deleted Successfully","error":false});
                        });
                    }catch(error){
                        console.log(error);
                        return res.status(400).json({"message" : "Error","error" : true});
                    }
                }
            )

module.exports = router;