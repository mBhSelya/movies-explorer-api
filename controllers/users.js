const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const devJWTSecret = require('../config');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function getMe(req, res, next) {
  return User
    .find(req.user)
    .then((user) => res.send({ data: user }))
    .catch(next);
}

function updateUser(req, res, next) {
  const { email, name } = req.body;
  const { _id } = req.user;

  return User
    .findByIdAndUpdate(_id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id ${_id} не найден`))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
}

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : devJWTSecret,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
}

function logOut(req, res) {
  res.status(200).clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }).send({ message: 'Выход' });
}

module.exports = {
  getMe,
  updateUser,
  createUser,
  login,
  logOut,
};
