const mongoose = require('mongoose');

const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&\\'()*+,;=.]+$/;

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlPattern.test(value),
      message: 'Поле "link" должно быть валидным url-адресом.',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlPattern.test(value),
      message: 'Поле "link" должно быть валидным url-адресом.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlPattern.test(value),
      message: 'Поле "link" должно быть валидным url-адресом.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('card', cardSchema);
