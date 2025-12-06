require('dotenv').config();
const pdfService = require('../src/services/pdfService');

const templateName = 'Formulir_Magang_BCA.pdf';

const sampleData = {
    nama_lengkap: 'Budi Santoso',
    jenis_kelamin: 'Laki-laki',
    status_pernikahan: 'Lajang',
    kewarganegaraan: 'WNI',
    agama: 'Islam',
    no_ktp: '1234567890123456',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '01/01/2000',
    jalan_ktp: 'Jl. Mawar No. 1',
    kota_ktp: 'Jakarta',
    provinsi_ktp: 'DKI Jakarta',
    kode_pos_ktp: '12345',
    email: 'budi@example.com',
    golongan_darah: 'O+',
    sim_gol_a: true,
    sim_gol_c: false,
    tidak_ada_sim: false,
    no_sim_a: 'A123456',
    no_sim_c: '',
    no_handphone: '081234567890',
    tinggi_badan: '170',
    berat_badan: '65',
    saya_1: 'Saya menyatakan data di atas benar.',
    saya_2: 'Bersedia mengikuti ketentuan program.',
    kota_ttd: 'Jakarta',
    tanggal_ttd: '01/12/2025',
    nama_jelas: 'Budi Santoso'
};

async function fillForm() {
    try {
        console.log('Filling PDF form...');
        const result = await pdfService.fillForm(templateName, sampleData);
        console.log('Filled PDF saved:', result.filename);
        console.log('   Path:', result.path);
        console.log('   Size:', result.size, 'bytes');
    } catch (error) {
        console.error('❌ Error filling form:', error.message);
        process.exitCode = 1;
    }
}

fillForm();
