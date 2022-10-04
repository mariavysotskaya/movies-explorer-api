const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/default');

const DataError = require('../errors/data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const options = { new: true, runValidators: true };

// signup
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({ email, password: hash, name })
              .then((data) => res.status(201).send({
                _id: data._id,
                email: data.email,
                name: data.name,
              }))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new DataError('Переданы невалидные значения'));
                  return;
                }
                next(err);
              });
          })
          .catch(next);
      }
    })
    .catch(next);
};

// signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не зарегистрирован');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильный пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : config.JWT_DEV_SECRET,
            { expiresIn: '7d' },
          );
          res.send({ _id: user._id, token, message: 'Авторизация успешна' });
        })
        .catch(next);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, options)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы невалидные значения'));
        return;
      }
      if (err.name === 'CastError') {
        next(new DataError('Переданы невалидные значения'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Указанный email уже используется'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createUser, login, getCurrentUser, updateUser,
};
