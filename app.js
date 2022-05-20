require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { devPort, devDBAdress } = require('./config');
const limiter = require('./middlewares/rate-limiter');

const { NODE_ENV, PORT, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect((NODE_ENV === 'production' ? DB_ADDRESS : devDBAdress), {
  useNewUrlParser: true,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen((NODE_ENV === 'production' ? PORT : devPort));
