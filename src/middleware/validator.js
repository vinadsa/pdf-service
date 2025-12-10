const { errorResponse } = require('../utils/response');

// Template constants (expand as new templates are added)
const SPAJ_TEMPLATE = 'CAR SPAJ.pdf';

// Helpers
const isString = (v) => typeof v === 'string';
const requireNonEmptyString = (value, name, errors) => {
    if (!isString(value) || value.trim() === '') {
        errors.push(`${name} is required and must be a non-empty string`);
    }
};
const allowEmptyString = (value, name, errors) => {
    if (!isString(value)) {
        errors.push(`${name} must be a string (can be empty)`);
    }
};
const requireEnumString = (value, name, allowed, errors) => {
    if (!isString(value)) {
        errors.push(`${name} is required and must be one of [${allowed.join(', ')}]`);
        return;
    }
    if (!allowed.includes(value)) {
        errors.push(`${name} must be one of [${allowed.join(', ')}]`);
    }
};

// SPAJ-specific validator. Sets the template name so callers do not need to send it.
const validateSPAJFormData = (req, res, next) => {
    const errors = [];

    if (!req.body || typeof req.body !== 'object') {
        return errorResponse(res, 'Request body is required', 400, ['Body missing']);
    }

    // Fix template name for SPAJ endpoint; reject mismatched templateName if provided
    req.templateName = SPAJ_TEMPLATE;
    if (req.body.templateName && req.body.templateName !== SPAJ_TEMPLATE) {
        errors.push(`templateName must be '${SPAJ_TEMPLATE}' for this endpoint`);
    }

    // Required non-empty strings
    const requiredFields = [
        'nama_lengkap', 'tempat_lahir', 'tanggal_hari_lahir', 'tanggal_bulan_lahir', 'tanggal_tahun_lahir',
        'usia', 'kewarganegaraan', 'nama_gadis_ibu', 'alamat_baris_1', 'email', 'nomor_spaj', 'nomor_polis',
        'nama_produk', 'nama_perusahaan', 'kode_perusahaan', 'nama_marketing', 'nama_koordinator_pemasaran',
        'no_customer', 'kota', 'nomor_telepon', 'nomor_hp', 'kode_pos', 'nik',
        'pekerjaan', 'uraian_pekerjaan', 'perusahaan', 'bidang_usaha', 'cabang_bank',
        'nama_pemilik_rekening', 'nama_bank', 'no_rekening', 'tujuan_pengajuan', 'uang_pertanggungan',
        'premi_sekaligus', 'tanggal_mulai_pertanggungan', 'bulan_mulai_pertanggungan', 'tahun_mulai_pertanggungan',
        'tanggal_akhir_pertanggungan', 'bulan_akhir_pertanggungan', 'tahun_akhir_pertanggungan',
        'lama_tahun_pertanggungan', 'lama_bulan_pertanggungan', 'tingkat_bunga', 'nama_penerima_manfaat',
        'hubungan_tertanggung', 'tinggi_badan',
        'berat_badan', 'persetujuan', 'nama_pemegang_polis', 'jabatan_pemegang_polis', 'tanggal_persetujuan',
        'nama_calon_tertanggung', 'tanggal_ttd_calon_tertanggung'
    ];

    requiredFields.forEach((field) => requireNonEmptyString(req.body[field], field, errors));

    // Optional-but-string fields (can be empty string)
    const optionalStringFields = [
        'pernyataan_kesehatan_2_a', 'pernyataan_kesehatan_2_b', 'pernyataan_kesehatan_3_a',
        'pernyataan_kesehatan_3_b', 'pernyataan_kesehatan_4_a', 'pernyataan_kesehatan_4_b',
        'pernyataan_kesehatan_5_a', 'pernyataan_kesehatan_5_b', 'usia_kehamilan'
    ];
    optionalStringFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            allowEmptyString(req.body[field], field, errors);
        }
    });

    // Enum validations
    requireEnumString(req.body.jns_kelamin, 'jns_kelamin', ['1', '2'], errors); // 1 = L, 2 = P
    requireEnumString(req.body.penghasilan, 'penghasilan', ['1', '2', '3', '4'], errors);
    requireEnumString(req.body.sumber_pendanaan, 'sumber_pendanaan', ['1', '2', '3', '4'], errors);
    const radioYesNo = ['1', '2'];
    requireEnumString(req.body.radio_pernyataan_2, 'radio_pernyataan_2', radioYesNo, errors);
    requireEnumString(req.body.radio_pernyataan_3, 'radio_pernyataan_3', radioYesNo, errors);
    requireEnumString(req.body.radio_pernyataan_4, 'radio_pernyataan_4', radioYesNo, errors);
    requireEnumString(req.body.radio_pernyataan_5_a, 'radio_pernyataan_5_a', radioYesNo, errors);
    requireEnumString(req.body.radio_pernyataan_5_b, 'radio_pernyataan_5_b', radioYesNo, errors);

    // Optional flatten flag
    if (req.body.flatten !== undefined && typeof req.body.flatten !== 'boolean') {
        errors.push('flatten must be a boolean when provided');
    }

    if (errors.length > 0) {
        return errorResponse(res, 'Validation failed', 400, errors);
    }

    next();
};

module.exports = { validateSPAJFormData };
