require('dotenv').config();
const pdfService = require('../src/services/pdfService');

const templateName = 'Formulir_Magang_BCA.pdf';

const chooseOption = (options = []) => {
    const cleaned = options.map((o) => (typeof o === 'string' ? o : String(o || '')));
    const nonPlaceholder = cleaned.find((o) => !/^\s*pili?h/i.test(o.trim()));
    return nonPlaceholder || cleaned[0] || '';
};

const buildData = (fields) => {
    const base = {
        nama_lengkap: 'Tester Lengkap',
        no_ktp: '9999999999999999',
        no_handphone: '081234567890',
        email: 'tester@example.com',
        kota_ttd: 'Jakarta',
        tanggal_ttd: '06/12/2025',
        nama_jelas: 'Tester Lengkap',
        tinggi_badan: '170',
        berat_badan: '65'
    };

    const data = { ...base };

    fields.forEach((field) => {
        const { name, type, options } = field;

        switch (type) {
            case 'PDFTextField':
                data[name] = data[name] || `Sample ${name}`;
                break;
            case 'PDFCheckBox':
                data[name] = true;
                break;
            case 'PDFDropdown':
            case 'PDFRadioGroup':
                data[name] = data[name] || chooseOption(options || []);
                break;
            default:
                break;
        }
    });

    return data;
};

async function fillAllFields() {
    try {
        console.log('Inspecting fields and preparing full fill...');
        const fields = await pdfService.inspectFields(templateName);
        console.log(`Found ${fields.length} fields, populating all...`);

        const data = buildData(fields);
        const result = await pdfService.fillForm(templateName, data);

        console.log('Filled PDF saved:', result.filename);
        console.log('   Path:', result.path);
        console.log('   Size:', result.size, 'bytes');
    } catch (error) {
        console.error('Error during full-field fill:', error.message);
        process.exitCode = 1;
    }
}

fillAllFields();
