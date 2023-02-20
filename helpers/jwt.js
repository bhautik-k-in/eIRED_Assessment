const redis = require('redis');
const APIError = require('../utils/APIError');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();

/**
 * @description Create a jwtr method object
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns object of jwtr
 */
exports.getJwt = async (req, res, next) => {
    try {
        await redisClient.connect();
        const jwtr = new JWTR(redisClient);
        return jwtr;
    } catch (error) {
        console.log(error);
        throw new APIError({ status: 500, message: "Internal Error" });
    }
    
}