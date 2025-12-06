const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');
const { validateFormData } = require('../middleware/validator');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Inspect PDF fields
router.get('/inspect/:templateName', async (req, res, next) => {
    try {
        const { templateName } = req.params;
        
        logger.info(`Inspecting template: ${templateName}`);
        
        const fields = await pdfService.inspectFields(templateName);
        
        return successResponse(res, {
            template: templateName,
            totalFields: fields.length,
            fields: fields
        }, 'Fields retrieved successfully');
        
    } catch (error) {
        next(error);
    }
});

// Fill a PDF form
router.post('/fill', validateFormData, async (req, res, next) => {
    try {
        const { templateName, flatten } = req.body;
        const formData = { ...req.body };
        delete formData.templateName;
        delete formData.flatten;

        logger.info(`Filling form for template: ${templateName}`);
        
        const result = await pdfService.fillForm(templateName, formData, { flatten });
        
        return successResponse(res, {
            filename: result.filename,
            path: result.path,
            downloadUrl: `/api/forms/download/${result.filename}`,
            size: result.size
        }, 'Form filled successfully', 201);
        
    } catch (error) {
        next(error);
    }
});

// Download filled PDF
router.get('/download/:filename', async (req, res, next) => {
    try {
        const { filename } = req.params;
        
        logger.info(`Download request for: ${filename}`);
        
        const filePath = await pdfService.getFilePath(filename);
        
        res.download(filePath, filename, (err) => {
            if (err) {
                next(err);
            }
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;