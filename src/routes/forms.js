const express = require('express');
const { inspectTemplate, fillForm, downloadFilled } = require('../controllers/formController');
const { validateFormData } = require('../middleware/validator');

const router = express.Router();

router.get('/inspect/:templateName', inspectTemplate);
router.post('/fill', validateFormData, fillForm);
router.get('/download/:filename', downloadFilled);

module.exports = router;
