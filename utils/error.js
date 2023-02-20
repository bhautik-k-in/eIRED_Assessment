const APIError = require("./APIError");
const { ValidationError } = require("express-validation");

/**
 * @description Get required error messages from error details
 * @author Bhautik Kevadiya
 * @param {*} err 
 * @returns Gets needed error message by types
 */
const getErrorMessage = (err) => {
    err = err.details;
    let validateError = [];
    if (err.query) err.query.map(item => validateError.push(item.message));
    else if (err.body) err.body.map(item => validateError.push(item.message));
    else if (err.params) err.params.map(item => validateError.push(item.message));
    return validateError;
}

/**
 * @description Global Error handler
 * @author Bhautik Kevadiya
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Sends Json Error Message
 */
exports.handler = (err, req, res, next) => {
    let message = err.message || "Something went wrong! Please try again later";
    if (!err.isPublic) err.message = err.stack || message;

    if (err.status === 422) message = "Invalid or Missing Parameters";
    else if (err.status === 500) {
        err.url = req.url;
        err.errMsg = message;
        return next(err);
    }
    if (err.stack) console.log(err.stack);
    if (err.erros) console.log(err.erros);

    return res.sendJson(err.status, message, err.data);
}

/**
 * @description Convert any error to common APIError object
 * @author Bhautik Kevadiya
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Sends converted custom APIError to the global error handler
 */
exports.converter = (err, req, res, next) => {
    let convertedError = err;
    if (err instanceof ValidationError) {
        convertedError = new APIError({ status: 422, data: getErrorMessage(err) });
    } else if (!(err instanceof APIError)) {
        convertedError = new APIError({ status: 500, isPublic: false, stack: err });
    }
    
    return this.handler(convertedError, req, res, next);
}