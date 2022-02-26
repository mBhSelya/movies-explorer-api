require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(cors({
  origin: 'https://diplom.mhselya.nomoredomains.work',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Application is running on port ${PORT}`);
});
