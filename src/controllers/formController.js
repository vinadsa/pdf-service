const pdfService = require('../services/pdfService');
const { successResponse } = require('../utils/response');
const logger = require('../utils/logger');

const inspectTemplate = async (req, res, next) => {
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
};

const fillForm = async (req, res, next) => {
    try {
        const templateName = req.templateName || req.body.templateName;
        const { flatten } = req.body;
        const formData = { ...req.body };
        delete formData.templateName;
        delete formData.flatten;

        if (!templateName) {
            throw new Error('Template name is required');
        }

        logger.info(`Filling form for template: ${templateName}`);

        const result = await pdfService.fillForm(templateName, formData, { flatten });

        return successResponse(res, {
            filename: result.filename,
            downloadUrl: `/api/forms/download/${result.filename}`,
            size: result.size
        }, 'Form filled successfully', 201);

    } catch (error) {
        next(error);
    }
};

const downloadFilled = async (req, res, next) => {
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
};

module.exports = {
    inspectTemplate,
    fillForm,
    downloadFilled
};