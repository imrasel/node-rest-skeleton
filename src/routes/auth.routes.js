const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/cms/auth.controller');
const auth = require('../middleware/auth');
const { loginValidation } = require('../validations/auth.validation');

const router = express.Router();

router.post('/login', loginValidation, authController.login);

router.use(auth);

module.exports = router;
