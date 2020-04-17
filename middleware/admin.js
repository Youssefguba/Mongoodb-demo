
module.exports = function (req, res, next) {
    //401 => unauthorized
    //403 => forbidden

    // Check is user is admin or not!
    if (!req.body.isAdmin) return res.status(403).send('Access denied.')
    next();
}