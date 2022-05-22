const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUpdateUser, validateLogin, validateCreateUser } = require('../middlewares/validation');
const {
  updateUser,
  getMe,
  logOut,
  createUser,
  login,
} = require('../controllers/users');

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUser, createUser);

router.get('/users/me', auth, getMe);
router.patch('/users/me', auth, validateUpdateUser, updateUser);
router.get('/signout', logOut);

module.exports = router;
