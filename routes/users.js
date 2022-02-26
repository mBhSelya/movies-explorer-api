const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser,
  getMe,
  logOut,
} = require('../controllers/users');

router.get('/users/me', getMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.get('/signout', logOut);

module.exports = router;
