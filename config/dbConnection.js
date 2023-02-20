const mongoose = require('mongoose');
const { database } = require('./index');

mongoose.set('strictQuery', true);
mongoose.connect(`${database.db_url}${database.name}`)
    .then(() => console.log("Database Connection Established".bgYellow.black))
    .catch(err => console.log(`There is some issue while connecting to the database.`.bgRed.black));

const USERS = require('../models/users');
const TASKS = require('../models/tasks');

module.exports = {
    USERS, TASKS
}