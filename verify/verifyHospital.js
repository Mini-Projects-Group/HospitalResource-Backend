const query = require('../shared/queryPromise');

const verifyHospital = async (req, res, next) => {
    if( req.user.type_id == 1) {
            next();
    } else {
        res.status(403);
        return res.json({error: true, message: "Forbidden."})
    } 
}

module.exports = verifyHospital;