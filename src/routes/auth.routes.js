const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authController = new AuthController();
const auth = require('../middleware/auth');
const { loginValidation, registerValidation } = require('../validations/auth.validation');
const router = express.Router();

router.post('/login', loginValidation, authController.login.bind(authController));
router.post('/register', registerValidation, authController.register.bind(authController));
// router.use(auth);

module.exports = router;
