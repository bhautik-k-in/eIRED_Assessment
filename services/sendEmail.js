const nodemailer = require('nodemailer');
const { emailDetails } = require('../config/index');
const APIError = require('../utils/APIError');

/**
 * @description Configuration for the node mailer service
 */
const transporter = nodemailer.createTransport({
    service: emailDetails.service,
    auth: {
        user: emailDetails.email,
        pass: emailDetails.password
    }
});

/**
 * @description Send email to the specified email address
 * @author Bhautik Kevadiya
 * @param {*} payload 
 * @returns Success message if mail sent successfully
 */
exports.sendEmail = async (payload, next) => {
    try {
        const result = await transporter.sendMail(payload);
        if (result) return result.response
        else throw new APIError({ status: 422, data: "There was an error sending the email" });
    } catch (error) {
        throw new APIError({ status: 422, data: "There was an error sending the email" });
    }
}