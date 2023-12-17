const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./logger');

const userModel = require('./models/user');

dotenv.config();
const { SERVER_PORT, CLIENT_URL, DATABASE_URI } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URI);
const db = mongoose.connection;

const server = express();
server.use(express.json());
server.use(
    cors({
        origin: '*',
        credentials: true,
        optionSuccessStatus: 200,
    })
);

db.on('error', error => {
    logger.error(`DB conection error, message: ${error.message}`);
});

db.once('open', () => {
    logger.info(`connected to DB: ${DATABASE_URI}`);
});

server.listen(SERVER_PORT, () => {
    logger.info(`server started, PORT=${SERVER_PORT}`);
});
