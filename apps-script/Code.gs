/**
 * SP PLN UIW NTB V1
 * Google Apps Script API untuk Google Sheets.
 *
 * Setelah ditempel ke Apps Script yang terhubung ke spreadsheet:
 * 1. Isi SPREADSHEET_ID.
 * 2. Deploy > New deployment > Web app.
 * 3. Access: sesuai kebutuhan organisasi.
 */

const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID';
const API_KEY = 'GANTI_DENGAN_API_KEY';

function doGet(e) {
  try {
    authorize_(e);
    const action = String(e?.parameter?.action || 'config').toLowerCase();

    const routes = {
      config: () => readSheet_('KONFIGURASI'),
      anggota: () => readSheet_('ANGGOTA'),
      berita: () => readSheet_('BERITA'),
      pengumuman: () => readSheet_('PENGUMUMAN'),
      agenda: () => readSheet_('AGENDA'),
      pengurus: () => readSheet_('PENGURUS'),
      dokumen: () => readSheet_('DOKUMEN')
    };

    if (!routes[action]) return json_({ ok: false, error: 'Action tidak dikenal' }, 400);
    return json_({ ok: true, action, data: routes[action]() });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) }, 500);
  }
}

function doPost(e) {
  try {
    authorize_(e);
    const body = JSON.parse(e?.postData?.contents || '{}');
    const action = String(body.action || '').toLowerCase();

    if (action === 'pengaduan') {
      appendRow_('PENGADUAN', [
        Utilities.getUuid(),
        body.id_anggota || '',
        body.kategori || '',
        body.judul || '',
        body.isi || '',
        body.lampiran || '',
        new Date(),
        'Diajukan',
        ''
      ]);
      return json_({ ok: true, message: 'Pengaduan berhasil diterima' });
    }

    return json_({ ok: false, error: 'Action POST tidak dikenal' }, 400);
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) }, 500);
  }
}

function authorize_(e) {
  const supplied = String(e?.parameter?.key || e?.parameter?.api_key || '');
  if (!API_KEY || API_KEY.indexOf('GANTI_') === 0) {
    throw new Error('API_KEY belum dikonfigurasi');
  }
  if (supplied !== API_KEY) throw new Error('Unauthorized');
}

function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('GANTI_') === 0) {
    throw new Error('SPREADSHEET_ID belum dikonfigurasi');
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function readSheet_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet ${sheetName} tidak ditemukan`);

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => String(h).trim());
  return values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])));
}

function appendRow_(sheetName, row) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet ${sheetName} tidak ditemukan`);
  sheet.appendRow(row);
}

function json_(payload, status) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...payload, status: status || 200 }))
    .setMimeType(ContentService.MimeType.JSON);
}
