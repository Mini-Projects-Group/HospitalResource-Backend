const express = require('express');
const passport = require('passport');
const verifySellerApprovingOrder = require('../verify/verifySellerApprovingOrder');
const query = require('../shared/queryPromise');
const verifyHospital = require('../verify/verifyHospital');

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
            if( seller_list[j].item_name.replace(/\s/g,'') == item_list[i].item.replace(/\s/g,'') &&
                 seller_list[j].quantity >= item_list[i].quantity) {
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
            let updateQuery = 
            "UPDATE item SET quantity=quantity-" + item_list[i].quantity + " WHERE seller_id=" + user_id + " AND item_name='" + item_list[i].item + "';";
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

    let updated_hospital_stock = 
    `UPDATE hospital_stock SET items='${JSON.stringify(hospital_items_list)}' WHERE hospital_id=${current_order[0].hospital_id};`;
    
    let result = await query(updated_hospital_stock);
    
    // CHANGING THE STATUS TO DELIVERED
    let updateQuery = 
    `UPDATE orders SET status='delivered', date_delivery=NOW() WHERE order_id=${order_id} AND seller_id=${user_id};`;
    result = await query(updateQuery);


        return res.json(
            {
                error:false,
                message:"Approved"
            });
    }
);


router.get('/',
    passport.authenticate('jwt',{session: false}),
    verifyHospital,
    async (req, res) => {
        try {
            let hospital_id = req.user.hospital_id;
            console.log(hospital_id);

            // GET THE STOCK AND ORDERS OF HOSPITAL LOGGED IN
            let hospital_orders_query = 
            `SELECT * FROM orders WHERE hospital_id=${hospital_id};`;
            let hospital_stock_query = 
            `SELECT * FROM hospital NATURAL JOIN hospital_stock WHERE hospital.hospital_id=${hospital_id};`;

            let orders = await query(hospital_orders_query);
            let stock = await query(hospital_stock_query);

            let stockPercentage = [];

            let items = JSON.parse(stock[0].items);
            let total = 0;
            for(i = 0 ; i < items.length ; i++ ) {
                total += items[i].quantity;
            }
            for(i = 0 ; i < items.length ; i++ ) {
                stockPercentage.push(
                    {
                        'item_name':items[i].item,
                        'percent': parseFloat((items[i].quantity/total) * 100 ).toFixed(2)
                    }
                );
            }

            let stockPercentage_used = [];
            let items_used = JSON.parse(stock[0].items_used);
            total = 0;
            for(i = 0 ; i < items_used.length ; i++ ) {
                total += items_used[i].quantity;
            }
            for(i = 0 ; i < items_used.length ; i++ ) {
                stockPercentage_used.push(
                    {
                        'item_name': items_used[i].item,
                        'percent': parseFloat((items_used[i].quantity/total)*100).toFixed(2)
                    }
                );
            }

            return res.json(
                {
                    error: false,
                    message: 'Hospital Info Delivered',
                    orders: orders,stock: stockPercentage,
                    stock_used: stockPercentage_used
                });
        } catch(e) {
            console.log(e);
            return res.json(
                {
                    error: true,
                    message: 'Unknown Error Occurred',
                    orders: [],
                    stock: [],
                    stock_used: []
                });
        }
});


// INPUT FORMAT
// {
//     "items": [
//         {
//             "item": "item 1",
//             "quantity": 10
//         },{
//             "item": "item 2",
//             "quantity": 4
//         }
//     ]
// }
router.post('/used',
    passport.authenticate('jwt',{session: false}),
    verifyHospital,
    async (req, res) => {
        try {
            // req.body.items is array of json object {item: value,quantity: value}
            let items = req.body.items;

            let stock = await query(`SELECT * FROM hospital_stock WHERE hospital_id=${req.user.hospital_id};`);
            let stock_items = JSON.parse(stock[0].items);
            let stock_used_items = JSON.parse(stock[0].items_used);

            for(i = 0 ; i < items.length ; i++ ) {

                // UPDATE THE LIST STOCK_ITEMS
                for(j = 0 ; j < stock_items.length ; j++ ) {
                    if(items[i].item.replace(/\s/g,'') == stock_items[j].item.replace(/\s/g,'')) {
                        if( items[i].quantity > stock_items[j].quantity ) {
                            return res.json({error: true, message: `You don't have sufficient ${items[i].item}`});
                        } else {
                            stock_items[j].quantity -= items[i].quantity;
                            break;
                        }
                    }
                }
                let flag = false;
                // UPDATE THE LIST STOCK_USED_ITEMS
                for(j = 0 ; j < stock_used_items.length ; j++ ) {
                    if(items[i].item.replace(/\s/g,'') == stock_used_items[j].item.replace(/\s/g,'')) {
                        stock_used_items[j].quantity += items[i].quantity;
                        flag = true;
                        break;
                    }
                }
                if( !flag ) stock_used_items.push(items[i]);
            }

            let update_stock_table = 
            `UPDATE hospital_stock SET items='${JSON.stringify(stock_items)}', items_used='${JSON.stringify(stock_used_items)}' WHERE hospital_id=${req.user.hospital_id};`;

            let result = await query(update_stock_table);

            return res.json({
                error: false,
                message: 'Items Added to Used'
            });

        } catch(e) {
            console.log(e);
            return res.json(
                {
                    error: true,
                    message: 'Unknown Error Occurred',
                });
        }
});


module.exports = router;