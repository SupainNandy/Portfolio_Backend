const jwt = require('jsonwebtoken')

async function authAdmin (req,res,next){
    try{
        const token = req.cookies && req.cookies.adminToken;

        if(!token){
            res.status(401).json({
                message:"Unauthrize"
        })
        }

        const decode = jwt.verify(token,process.env.JWT_SKEY)

        req.admin = decode

        next()

    }catch(err){
        console.log(err.message)
        console.log("auth middlware error")
        res.status(500).json({message:"Auth middleware error"})
    }
}

module.exports = authAdmin