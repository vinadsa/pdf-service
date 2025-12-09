require('dotenv').config();
const pdfService = require('../src/services/pdfService');

const templateName = 'CAR SPAJ CLEAN.pdf';

const chooseOption = (options = []) => {
    const cleaned = options.map((o) => (typeof o === 'string' ? o : String(o || '')));
    const nonPlaceholder = cleaned.find((o) => !/^\s*pili?h/i.test(o.trim()));
    return nonPlaceholder || cleaned[0] || '';
};

const buildData = (fields) => {
    const base = {
        // === Data dasar dari base ===
        nama_lengkap: 'Kevin Adi Santoso',
        tempat_lahir: 'Ungaran',
        tanggal_hari_lahir: '04',
        tanggal_bulan_lahir: '06',
        tanggal_tahun_lahir: '2005',
        usia: '20',
        kewarganegaraan: 'Indonesia',
        nama_gadis_ibu: 'Tien Nio',
        alamat_baris_1: 'Jl. Parasamya Tengah No. 149',
        email: 'kevinadsantoso@gmail.com',

        // === DIISI BEBAS DAN LENGKAP ===
        nomor_spaj: 'SPAJ-2025-0001',
        nomor_polis: 'POL-789456123',
        nama_produk: 'Asuransi Jiwa Premier',
        nama_perusahaan: 'PT Asuransi Sejahtera',
        kode_perusahaan: 'ASJ001',
        nama_marketing: 'Budi Santosa',
        nama_koordinator_pemasaran: 'Rina Kartika',
        no_customer: 'CUST-55231',
        alamat_baris_2: 'Kel. Gedanganak, Kec. Ungaran Timur',
        kota: 'Semarang',
        nomor_telepon: '0247654321',
        nomor_hp: '081234567890',
        kode_pos: '50512',
        nik: '3374021605050001',
        npwp: '12.345.678.9-012.345',
        pekerjaan: 'Software Developer',
        uraian_pekerjaan: 'Mengembangkan aplikasi web dan mobile',
        perusahaan: 'PT Andatara Indonesia',
        bidang_usaha: 'Teknologi Informasi',
        sumber_pendanaan_text: 'Dana tabungan pribadi',
        cabang_bank: 'Bank BCA Ungaran',
        nama_pemilik_rekening: 'Kevin Adi Santoso',
        nama_bank: 'Bank BCA',
        no_rekening: '1234567890',
        tujuan_pengajuan: 'Perlindungan diri dan investasi jangka panjang',
        uang_pertanggungan: '500.000.000',
        premi_sekaligus: '5.000.000',
        tanggal_mulai_pertanggungan: '01',
        bulan_mulai_pertanggungan: '01',
        tahun_mulai_pertanggungan: '2026',
        tanggal_akhir_pertanggungan: '01',
        bulan_akhir_pertanggungan: '01',
        tahun_akhir_pertanggungan: '2031',
        lama_tahun_pertanggungan: '5',
        lama_bulan_pertanggungan: '0',
        tingkat_bunga: '5%',
        nama_penerima_manfaat: 'Tien Nio',
        hubungan_tertanggung: 'Ibu Kandung',
        polis_lain_1: 'POLIS-001-A',
        polis_lain_2: 'POLIS-002-B',
        jumlah_uang_1: 'Rp 250.000.000',
        jumlah_uang_2: 'Rp 150.000.000',
        nama_asuransi_1: 'PT Asuransi Sehat Selalu',
        nama_asuransi_2: 'PT Asuransi Mandiri',
        hasil_akseptasi_1: 'Diterima',
        hasil_akseptasi_2: 'Diterima',

        // ==== Pernyataan Kesehatan ====
        tinggi_badan: '175',
        berat_badan: '68',

        // Semua radio pernyataan = 2 → Tidak → field boleh kosong:
        pernyataan_kesehatan_2_a: '',
        pernyataan_kesehatan_2_b: '',
        pernyataan_kesehatan_3_a: '2022',
        pernyataan_kesehatan_3_b: 'Demam berdarah',
        pernyataan_kesehatan_4_a: '',
        pernyataan_kesehatan_4_b: '',
        pernyataan_kesehatan_5_a: '',
        pernyataan_kesehatan_5_b: '',
        usia_kehamilan: '',

        persetujuan: 'SETUJU',
        nama_pemegang_polis: 'Joseph Wicaksono',
        jabatan_pemegang_polis: 'Wakil Direktur',
        tanggal_persetujuan: '09-12-2025',
        nama_calon_tertanggung: 'Kevin Adi Santoso',
        tanggal_ttd_calon_tertanggung: '09-12-2025',

        // === RADIO ===

        // 1 = Laki-laki
        jns_kelamin: '1',

        // Penghasilan → pilih angka logis
        penghasilan: '3',

        // Sumber pendanaan → 4 → wajib isi text
        sumber_pendanaan: '4',

        // Semua pernyataan kesehatan = Tidak
        radio_pernyataan_2: '2',
        radio_pernyataan_3: '1',
        radio_pernyataan_4: '2',
        radio_pernyataan_5_a: '2',
        radio_pernyataan_5_b: '2'
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
