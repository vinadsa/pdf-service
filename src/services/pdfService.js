const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const fieldMapper = require('./fieldMapper');
const logger = require('../utils/logger');

class PDFService {
    constructor() {
        this.templatesDir = config.paths.templates;
        this.outputDir = config.paths.output;
    }

    async loadTemplate(templateName) {
        if (!templateName) {
            throw new Error('Template name is required');
        }

        const templatePath = path.resolve(this.templatesDir, templateName);

        // Prevent path traversal outside templates directory
        if (!templatePath.startsWith(this.templatesDir)) {
            throw new Error('Invalid template path');
        }
        
        try {
            const pdfBytes = await fs.readFile(templatePath);
            return await PDFDocument.load(pdfBytes);
        } catch (error) {
            throw new Error(`Failed to load template: ${templateName}`);
        }
    }

    async inspectFields(templateName) {
        const pdfDoc = await this.loadTemplate(templateName);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        return fields.map(field => {
            const name = field.getName();
            const type = field.constructor.name;
            
            let options = null;
            if (type === 'PDFDropdown') {
                options = field.getOptions();
            } else if (type === 'PDFRadioGroup') {
                options = field.getOptions();
            }
            
            return {
                name,
                type,
                options
            };
        });
    }

    async fillForm(templateName, data = {}, options = {}) {
        const pdfDoc = await this.loadTemplate(templateName);
        const form = pdfDoc.getForm();

        // Map and fill fields
        await fieldMapper.fillFormFields(form, data);

        // Flatten form (optional - makes it read-only)
        if (options.flatten !== false) {
            form.flatten();
        }

        // Save PDF
        const pdfBytes = await pdfDoc.save();

        // Generate filename
        const timestamp = new Date().getTime();
        const baseName = path.parse(templateName).name || 'filled';
        const requester = data.nama_lengkap?.replace(/\s+/g, '_') || 'filled';
        const filename = `${baseName}_${requester}_${timestamp}.pdf`;
        const outputPath = path.join(this.outputDir, filename);

        await fs.writeFile(outputPath, pdfBytes);

        logger.info(`PDF saved: ${filename}`);

        return {
            filename,
            path: outputPath,
            size: pdfBytes.length
        };
    }

    async getFilePath(filename) {
        const filePath = path.resolve(this.outputDir, filename);

        if (!filePath.startsWith(this.outputDir)) {
            throw new Error('Invalid file path');
        }
        
        try {
            await fs.access(filePath);
            return filePath;
        } catch (error) {
            throw new Error('File not found');
        }
    }
}

module.exports = new PDFService();