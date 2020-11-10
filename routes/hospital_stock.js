const express = require('express');
const passport = require('passport');
const verifySellerApprovingOrder = require('../verify/verifySellerApprovingOrder');
const query = require('../shared/queryPromise');

const router = express.Router();

router.get('/approve/:order_id',
    passport.authenticate('jwt',{ session : false}),
    verifySellerApprovingOrder,
    async( req , res ) => {

    let user_id = req.user.seller_id;
    let order_id = req.params.order_id;

    let current_order = await query(`SELECT * FROM orders WHERE order_id=${order_id} AND seller_id=${user_id};`);
    let hospital_stock = await query(`SELECT * FROM hospital_stock WHERE hospital_id=${current_order[0].hospital_id};`);
    let seller_list = await query(`SELECT * FROM item WHERE seller_id=${user_id};`)


    let hospital_items_list = JSON.parse(hospital_stock[0].items);
    let item_list = JSON.parse(current_order[0].items);


    let canFulfill = 1;
    for(i = 0 ; i < item_list.length ; i++ ) {
        let flag = false;
        for(j = 0 ; j < seller_list.length ; j++ ) {
            // console.log(i,j,item_list[i].item,seller_list[j].item_name,seller_list[j].item_name.replace(/\s/g,'') == item_list[i].item.replace(/\s/g,''));

            if( seller_list[j].item_name.replace(/\s/g,'') == item_list[i].item.replace(/\s/g,'') && seller_list[j].quantity >= item_list[i].quantity) {
                // console.log(i,j,item_list[i],seller_list[j]);
                flag = true;
            }
        }
        if(flag == false) canFulfill = 0;
    }
    if(canFulfill == 0) {
        return res.json({error: true,message: "Seller does not have sufficient items." })
    } else {
        // UPDATE THE SELLER TABLE
        for(i = 0 ; i < item_list.length ; i++ ) {
            let updateQuery = "UPDATE item SET quantity=quantity-" + item_list[i].quantity + " WHERE seller_id=" + user_id + " AND item_name='" + item_list[i].item + "';";
            let result = query(updateQuery);
        }
    }

    for(i = 0 ; i < item_list.length ; i++ ) {
        let flag = false;
        for(j = 0 ; j < hospital_items_list.length ; j++ ) {
            if( hospital_items_list[j].item.replace(/\s/g,'') == item_list[i].item.replace(/\s/g,'')) {
                flag = true;
                hospital_items_list[j].quantity += item_list[i].quantity;
            }
        }
        if(flag == false) hospital_items_list.push({item: item_list[i].item,quantity: item_list[i].quantity});
    }

    let updated_hospital_stock = `UPDATE hospital_stock SET items='${JSON.stringify(hospital_items_list)}' WHERE hospital_id=${current_order[0].hospital_id};`;
    let result = await query(updated_hospital_stock);
    
    // CHANGING THE STATUS TO DELIVERED
    let updateQuery = `UPDATE orders SET status='delivered', date_delivery=NOW() WHERE order_id=${order_id} AND seller_id=${user_id};`;
    result = await query(updateQuery);


        return res.json({error:false,message:"Approved"});
    }
);


module.exports = router;