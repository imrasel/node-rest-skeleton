const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const brandController = require('../controllers/cms/brand.controller');
const auth = require('../middleware/auth');
const { createValidation, updateValidation } = require('../validations/brand.validation');



router.use(auth);
router.post('/', createValidation, brandController.create);
router.get('/slug/:slug', brandController.getBySlug);
router.get('/:brandId', brandController.getById);
router.get('/', brandController.get);
router.put('/:brandId', updateValidation, brandController.update);
router.delete('/:brandId', brandController.delete);

module.exports = router;
