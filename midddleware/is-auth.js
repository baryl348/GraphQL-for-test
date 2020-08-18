const jwt = require("jsonwebtoken")


require('dotenv').config()

module.exports= (req, res, next) => {
    const authHeader = req.headers["Authorization"];
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    if (authHeader) {
        let bearerToken =authHeader.split(" ");
        if (bearerToken.length == 2 && bearerToken[0].toLowerCase()=="bearer"){
            jwt.verify(bearerToken[1], process.env.JWT_SECRET,
                function( error, decodedToken){
                    if (error) {
                        return res.status(401).json({
                            name: "NOT_VALID_TOKEN",
                            message: "Invalid authorization token",
                            statusCode: 401
                        });
                    }

                    req.decodedToken = decodedToken;
                    next();
                }
            );

        }else {
            next();
        }
    } else {
        next();
    }
    // const token = authHeader.split(" ")[1]
    // if (!token || token === "") {
    //     req.isAuth = false;
    //     return next();
    // }
    // let decodedToken;
    // try {
    //     decodedToken = jwt.verify(token, "secretOrPrivateKeyForUserToken123")
    // } catch (err) {
    //     req.isAuth = false;
    //     return next()
    // }
    // if (!decodedToken) {
    //     req.isAuth = false;
    //     return next();
    // }
    // req.isAuth = true;
    // req.userId = decodedToken.userId;
    // next();
}


