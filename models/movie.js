const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
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
      validator: (value) => (validator.isURL(value, { require_protocol: true })),
      message: 'Ссылка указана некорректно',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => (validator.isURL(value, { require_protocol: true })),
      message: 'Ссылка указана некорректно',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => (validator.isURL(value, { require_protocol: true })),
      message: 'Ссылка указана некорректно',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле обязательно'],
  },
  movieId: {
    type: String,
    required: [true, 'Поле обязательно'],
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

module.exports = mongoose.model('movie', movieSchema);
