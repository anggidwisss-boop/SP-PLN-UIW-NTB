const SHEETS = ['ANGGOTA','BERITA','PENGUMUMAN','AGENDA','PENGURUS','DOKUMEN','PENGADUAN','KONFIGURASI'];
const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID';
const API_KEY = 'GANTI_DENGAN_API_KEY';

function doGet(e) {
  try {
    authorize_(e);
    const action = String(e?.parameter?.action || 'config').toLowerCase();
    if (!SHEETS.includes(action.toUpperCase())) return json_({ok:false,error:'Action tidak dikenal'},400);
    return json_({ok:true,action,data:readSheet_(action.toUpperCase())});
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function doPost(e) {
  try {
    authorize_(e);
    const body = JSON.parse(e?.postData?.contents || '{}');
    if (String(body.action || '').toLowerCase() !== 'pengaduan') return json_({ok:false,error:'Action POST tidak dikenal'},400);
    appendRow_('PENGADUAN',[Utilities.getUuid(),body.id_anggota||'',body.kategori||'',body.judul||'',body.isi||'',body.lampiran||'',new Date(),'Diajukan','']);
    return json_({ok:true,message:'Pengaduan berhasil diterima'});
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function authorize_(e) {
  const supplied = String(e?.parameter?.key || e?.parameter?.api_key || '');
  if (!API_KEY || API_KEY.indexOf('GANTI_') === 0 || supplied !== API_KEY) throw new Error('Unauthorized / API_KEY belum dikonfigurasi');
}
function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('GANTI_') === 0) throw new Error('SPREADSHEET_ID belum dikonfigurasi');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
function readSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h=>String(h).trim());
  return values.slice(1).filter(r=>r.some(v=>String(v).trim()!=='')).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function appendRow_(name,row) {
  const sheet=getSpreadsheet_().getSheetByName(name);
  if(!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  sheet.appendRow(row);
}
function json_(payload,status) {
  return ContentService.createTextOutput(JSON.stringify({...payload,status:status||200})).setMimeType(ContentService.MimeType.JSON);
}