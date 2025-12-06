const logger = require('../utils/logger');

// Normalize keys to improve matching between request data and PDF field names
const normalize = (value) => value?.toString().toLowerCase().replace(/[^a-z0-9]/g, '') || '';

const isTruthy = (value) => {
    if (Array.isArray(value)) return value.length > 0;
    const val = value?.toString().toLowerCase();
    return ['true', 'yes', 'y', '1', 'on', 'checked'].includes(val);
};

const findOptionMatch = (value, options = []) => {
    const normalizedValue = normalize(value);
    return options.find((opt) => normalize(opt) === normalizedValue) || null;
};

const setFieldValue = (field, value) => {
    const type = field.constructor.name;

    try {
        switch (type) {
            case 'PDFTextField':
            case 'PDFSignature':
                field.setText(value ?? '');
                break;
            case 'PDFCheckBox':
                if (isTruthy(value)) {
                    field.check();
                } else {
                    field.uncheck();
                }
                break;
            case 'PDFDropdown': {
                const options = field.getOptions().map(String);
                const match = findOptionMatch(value, options);
                if (match) field.select(match);
                break;
            }
            case 'PDFRadioGroup': {
                const options = field.getOptions().map(String);
                const match = findOptionMatch(value, options);
                if (match) field.select(match);
                break;
            }
            default:
                break;
        }
    } catch (err) {
        logger.warn(`Failed to set field ${field.getName()} (${type}): ${err.message}`);
    }
};

async function fillFormFields(form, data = {}) {
    const fields = form.getFields();
    const normalizedData = Object.fromEntries(
        Object.entries(data).map(([key, val]) => [normalize(key), val])
    );

    fields.forEach((field) => {
        const normalizedName = normalize(field.getName());
        if (normalizedData.hasOwnProperty(normalizedName)) {
            setFieldValue(field, normalizedData[normalizedName]);
        }
    });
}

module.exports = { fillFormFields };
