require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const { PORT, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(cors({
  origin: 'https://mesto.mbhselya.nomoredomains.xyz', // Когда создам домен подставить сюда!
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Application is running on port ${PORT}`);
});