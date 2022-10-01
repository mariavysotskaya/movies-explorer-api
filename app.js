const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const config = require('./config/default');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const app = express();

app.use(helmet());

app.use(require('./middlewares/rateLimiter'));

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.mongoUri);
} else {
  mongoose.connect(config.mongoUri);
}

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(require('./middlewares/err-handle'));

app.listen(config.PORT);
