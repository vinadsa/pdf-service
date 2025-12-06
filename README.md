# PDF Form Service

Service Node.js untuk menginspeksi dan mengisi PDF form secara generik. Mendukung pemilihan template per-request, mapping field otomatis berbasis nama field PDF, serta download hasil isian.

## Fitur
- Inspect field template PDF (`getFields`) termasuk opsi radio/dropdown.
- Isi semua/selektif field dengan payload JSON generik.
- Opsi flatten (membuat PDF read-only) default aktif.
- Middleware keamanan: Helmet, Rate Limit, CORS, logging, error handler.
- Proteksi path traversal pada akses template dan output.

## Prasyarat
- Node.js 18+
- File template PDF ditempatkan di direktori `templates/` (atau set `TEMPLATE_DIR`).

## Konfigurasi Environment
Contoh `.env` minimal:
```
PORT=3001
HOST=localhost
TEMPLATE_DIR=./templates
OUTPUT_DIR=./output
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## Menjalankan
```
npm install
npm run dev   # nodemon
npm start     # produksi sederhana
```

## API
Base path: `/api/forms`

### Health
- `GET /health`

### Inspect Template Fields
- `GET /api/forms/inspect/:templateName`
- Response: `{ template, totalFields, fields: [{ name, type, options? }] }`

### Fill PDF
- `POST /api/forms/fill`
- Body JSON:
```
{
  "templateName": "Formulir_Magang_BCA.pdf", // wajib, nama file di folder template
  "flatten": true,                            // opsional, default true
  "data": {                                   // opsional; jika tidak ada, field dibiarkan kosong
    "Nama Lengkap": "Jane Doe",             // kunci akan dinormalisasi (case/spacing/underscore)
    "Jenis Kelamin": "Perempuan",           // radio/dropdown pilih opsi yang cocok
    "SIM Gol. A": true                       // checkbox true/false
  }
}
```
- Catatan: Jika field berada di level root (tanpa objek `data`), properti selain `templateName`/`flatten` juga akan diisi; gunakan objek `data` untuk payload yang lebih terstruktur.
- Response: `{ filename, path, downloadUrl, size }`

### Download PDF
- `GET /api/forms/download/:filename`

## Testing & Contoh Lokal
- Inspect cepat: `npm run inspect`
- Isi sampel: `npm run test:fill`
- Isi seluruh field (auto): `npm run test:fill-full`

## Catatan Implementasi
- `pdfService.fillForm(templateName, data, { flatten })` adalah entry point utama pengisian.
- Field mapping menggunakan normalisasi nama (lowercase, alfanumerik) sehingga payload fleksibel.
- Path template/output divalidasi agar tidak keluar dari direktori yang dikonfigurasi.
