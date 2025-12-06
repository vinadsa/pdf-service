const { errorResponse } = require('../utils/response');

const validateFormData = (req, res, next) => {
    const { templateName } = req.body;

    const errors = [];

    if (!templateName || typeof templateName !== 'string') {
        errors.push('templateName is required and must be a string');
    }

    if (errors.length > 0) {
        return errorResponse(res, 'Validation failed', 400, errors);
    }

    next();
};

module.exports = { validateFormData };
