const query = require('../shared/queryPromise');

const verifyHospital = async (req, res, next) => {
    if( req.user.type == 'hospital') {
            next();
    } else {
        res.status(403);
        return res.json({error: true, message: "Forbidden."})
    } 
}

module.exports = verifyHospital;