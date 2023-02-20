const Joi = require('joi');
const { errorMessage } = require('../helpers/errorMessages');
const { patterns } = require('../helpers/patterns');

/**
 * Register route validation
 */
exports.register = {
    body: Joi.object({
        name: Joi.string().required().min(4).max(30).messages(errorMessage('Name')),
        email: Joi.string().required().email().messages(errorMessage('Email')),
        password: Joi.string().required().regex(patterns.password).messages(errorMessage('Password')),
    })
}

/**
 * Login route validation
 */
exports.login = {
    body: Joi.object({
        email: Joi.string().required().email().messages(errorMessage('Email')),
        password: Joi.string().required().regex(patterns.password).messages(errorMessage('Password'))
    })
}

/**
 * Verify OTP route validation
 */
exports.verify = {
    body: Joi.object({
        email: Joi.string().required().email().messages(errorMessage('Email')),
        otp: Joi.string().trim().required().regex(patterns.otp).messages(errorMessage('Otp'))
    })
}