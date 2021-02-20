const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/cms/user.controller');
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const auth = require('../middleware/auth');
const { createValidation } = require('../validations/user.validation');

const router = express.Router();

router.get('/', userController.index.bind(userController));
router.post('/', userController.create.bind(userController));
// router.use(auth);
router.get('/:id', userController.getById.bind(userController));
// router.patch('/:id', usersController.update);
router.delete('/:id', userController.delete.bind(userController));

module.exports = router;
