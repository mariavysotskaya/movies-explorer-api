const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const config = require('./config/default');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://movieget.nomoredomains.icu',
    'http://movieget.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use('*', cors(options));

app.use(helmet());

app.use(require('./middlewares/rateLimiter'));

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGO_URI);
} else {
  mongoose.connect(config.MONGO_URI_DEV);
}

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(require('./middlewares/err-handle'));

app.listen(config.PORT);
