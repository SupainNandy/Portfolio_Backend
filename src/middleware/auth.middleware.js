const jwt = require("jsonwebtoken");

async function authAdmin(req, res, next) {
    try {
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SKEY);

        req.admin = decode;

        next();

    } catch (err) {
        console.log(err);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authAdmin;