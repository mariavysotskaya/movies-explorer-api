const Movie = require('../models/movie');
const DataError = require('../errors/data-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find()
    .then((data) => res.send(data))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы невалидные значения'));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findOne({ _id: req.params.id })
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Не найден фильм с указанным _id'));
        return;
      }
      if (movie.owner.equals(req.user._id)) {
        Movie.deleteOne({ _id: movie._id })
          .then(() => res.send({ message: 'Фильм удален' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Нет прав на удаление фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Передан некорректный _id фильма'));
        return;
      }
      next(err);
    });
};

module.exports = { getMovies, addMovie, deleteMovie };
