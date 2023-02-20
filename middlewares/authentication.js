const APIError = require("../utils/APIError");
const { USERS } = require("../config/dbConnection");
const jwt = require('jsonwebtoken');
const { jwtKeys } = require("../config");

/**
 * AUTHENTICATION
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.isAuth = (req, res, next) => async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) throw new APIError({ status: 401, message: "Token is required" })

        jwt.verify(token, jwtKeys.secretKey, async (err, result) => {
            if (err) throw new APIError({ status: 401, message: err.message });

            const isUserExist = await USERS.findOne({ email: result.email });
            if (!isUserExist) return res.sendJson(404, "User does not exist");

            if (!isUserExist.isVerified) return res.sendJson(401, "Please verify your account. Try login and it will sent you an OTP on your email");
            req.user = isUserExist;
            next();
        });

    } catch (error) {
        next(error);
    }
}
