const express = require('express');
const { inspectTemplate, fillForm, downloadFilled } = require('../controllers/formController');
const { validateSPAJFormData } = require('../middleware/validator');

const router = express.Router();

router.get('/inspect/:templateName', inspectTemplate);
router.post('/SPAJ', validateSPAJFormData, fillForm);
router.get('/download/:filename', downloadFilled);

module.exports = router;
