require('dotenv').config();
const pdfService = require('../src/services/pdfService');

async function inspectBCAForm() {
    try {
        console.log('Inspecting BCA Magang Form...\n');
        
        const fields = await pdfService.inspectFields('Formulir_Magang_BCA.pdf');
        
        console.log(`Total Fields: ${fields.length}\n`);
        
        // Group by type
        const grouped = fields.reduce((acc, field) => {
            acc[field.type] = acc[field.type] || [];
            acc[field.type].push(field);
            return acc;
        }, {});
        
        Object.entries(grouped).forEach(([type, fieldList]) => {
            console.log(`\n${type} (${fieldList.length}):`);
            fieldList.forEach(field => {
                console.log(`  - ${field.name}`);
                if (field.options) {
                    console.log(`    Options: ${field.options.join(', ')}`);
                }
            });
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectBCAForm();
