const APIError = require('../utils/APIError');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const redis = require('redis');
const moment = require('moment');
const { getJwt } = require('../helpers/jwt');

const { jwtKeys } = require('../config/index');
const { generateRandomNumber } = require('../utils/generateRandomNumber');
const { sendEmail } = require('../services/sendEmail');
const { excludeFields } = require('../helpers/excludeFields');
const { USERS } = require('../config/dbConnection');


/**
 * @description Register new user
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Newly Created User
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const isExist = await USERS.findOne({ email }, { ...excludeFields() });
        if (isExist) throw new APIError({ status: 401, message: "Looks like this email already exists." });

        const newUser = (await USERS.create({ name, email, password })).toObject();
        return res.sendJson(201, "User Registered Successfully", newUser);
    } catch (error) {
        next(error);
    }
}

/**
 * @description Verify the OTP
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Verification of OTP and send token
 */
exports.verify = async (req, res, next) => {
    try {
        const { otp, email } = req.body;

        const isUserExist = await USERS.findOne({ email }, { ...excludeFields(['otpSentAt', 'OTP']) });
        if (!isUserExist) throw new APIError({ status: 404, message: "User does not exist" });

        const currentDate = new moment(new Date().toISOString());
        const otpExpireDate = new moment(new Date(isUserExist.otpSentAt).toISOString());
        const isExpired = currentDate.diff(otpExpireDate, 'minutes');
        if (isExpired > 5) throw new APIError({ status: 400, message: 'OTP has expired. Please resend OTP' });
        if (+otp !== +isUserExist.OTP) throw new APIError({ status: 401, message: 'Invalid OTP' });

        await isUserExist.updateOne({ isVerified: true });
        const jwtr = await getJwt();
        const token = jwtr.sign(isUserExist.toObject(), jwtKeys.secretKey, { expiresIn: '1d' });

        return res.sendJson(200, "Verification is successful", { token: token });
    } catch (error) {
        next(error);
    }
}

/**
 * @description Login method
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Returns a token that can be used
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const isUserExist = await USERS.findOne({ email }, { ...excludeFields(['password']) });
        if (!isUserExist) throw new APIError({ status: 404, message: "User does not exist" });

        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);
        if (!isPasswordValid) throw new APIError({ status: 401, message: 'Email or Password is wrong' });

        const randomOTP = generateRandomNumber(0, 9, 6).join("");
        await isUserExist.updateOne({ OTP: randomOTP, otpSentAt: new Date() });

        const emailPayload = {
            to: email,
            subject: 'Verification OTP',
            html: `<b>Hello, <strong>${isUserExist.name}</strong>, Your otp is:\n<b>${randomOTP} <br>Please do not share your code with anyone. This code is valid for 5 minutes only</b></p>`
        }
        const emailSentResult = await sendEmail(emailPayload);

        if (emailSentResult) return res.sendJson(200, `Verification mail is sent successfully on ${email}. Please check your inbox`);
        else throw new APIError({ status: 401, message: "Invalid email address or email does not exist on an internet" });
    } catch (error) {
        next(error);
    }
}

/**
 * @description Redis jwt destroy
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Return the logged out message
 */
exports.logout = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        await jwtr.destroy(token);
        return res.sendJson(200, "Logged out");
    } catch (error) {
        next(error);
    }
}
