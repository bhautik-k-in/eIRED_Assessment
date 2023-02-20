require('dotenv').config();
require('./config/dbConnection');
require('colors');

const logger = require('morgan');
const express = require('express');
const { sendJson } = require('./utils/generateResponse');
const error = require('./utils/error');

const app = express();

app.response.sendJson = sendJson;
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/index.routes'));

// Global Error Handler
app.use(error.converter);

app.listen(process.env.PORT || 4000, () => {
    console.log(`SERVER IS RUNNING ON http://localhost:${process.env.PORT || 4000}`.bgGreen.black);
});