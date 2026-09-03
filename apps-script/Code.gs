const SHEETS = ['ANGGOTA','BERITA','PENGUMUMAN','AGENDA','PENGURUS','DOKUMEN','PENGADUAN','KONFIGURASI'];
const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID';
const API_KEY = 'GANTI_DENGAN_API_KEY';

function doGet(e) {
  try {
    const action = String(e?.parameter?.action || 'health').toLowerCase();
    if (action === 'health') return json_({ok:true,action:'health',message:'SP PLN UIW NTB API aktif'});
    authorize_(e?.parameter?.key || e?.parameter?.api_key || '');
    if (!SHEETS.includes(action.toUpperCase())) return json_({ok:false,error:'Action tidak dikenal'},400);
    return json_({ok:true,action,data:readSheet_(action.toUpperCase())});
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function doPost(e) {
  try {
    const body = JSON.parse(e?.postData?.contents || '{}');
    authorize_(body.key || '');
    const action = String(body.action || '').toLowerCase();

    if (action === 'login') {
      const id = String(body.id || '').trim();
      const password = String(body.password || '');
      if (!id || !password) return json_({ok:false,error:'ID dan password wajib diisi'},400);
      const rows = readSheet_('ANGGOTA');
      const member = rows.find(r => String(r.ID_ANGGOTA || '').trim() === id || String(r.NIP || '').trim() === id);
      if (!member) return json_({ok:false,error:'Anggota tidak ditemukan'},401);
      if (String(member.PASSWORD || '') !== password) return json_({ok:false,error:'Password salah'},401);
      const safe = {...member}; delete safe.PASSWORD;
      return json_({ok:true,message:'Login berhasil',data:safe});
    }

    if (action === 'pengaduan') {
      appendRow_('PENGADUAN',[Utilities.getUuid(),body.id_anggota||'',body.kategori||'',body.judul||'',body.isi||'',body.lampiran||'',new Date(),'Diajukan','']);
      return json_({ok:true,message:'Pengaduan berhasil diterima'});
    }

    return json_({ok:false,error:'Action POST tidak dikenal'},400);
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function authorize_(supplied) {
  supplied = String(supplied || '');
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