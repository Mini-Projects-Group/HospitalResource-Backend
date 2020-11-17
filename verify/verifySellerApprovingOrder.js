const connection = require("../db/connection");

const query = require("../shared/queryPromise");

const verifySellerApprovingOrder = async(req, res, next) => {
    let user_id = req.user.seller_id;
    let order_id = req.params.order_id;



    let result = await query(
        `SELECT * FROM orders WHERE order_id=${order_id} AND seller_id=${user_id};`
    );
    // NOT FOUND
    if (result.length == 0) {
        res.status(404);
        return res.json({ error: true, message: "Order ID Incorrect" });
    } else if (result[0].status != "pending") {
        res.status(404);
        return res.json({
            error: true,
            message: "Order Has Already Been Delivered.",
        });
    } else {
        next();
    }
};

module.exports = verifySellerApprovingOrder;