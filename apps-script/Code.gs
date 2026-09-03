const SHEETS = ['ANGGOTA','BERITA','PENGUMUMAN','AGENDA','PENGURUS','DOKUMEN','PENGADUAN','KONFIGURASI'];
const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID';
const API_KEY = 'GANTI_DENGAN_API_KEY';

function doGet(e) {
  try {
    const action = String(e?.parameter?.action || 'health').toLowerCase();
    if (action === 'health') return json_({ok:true,action:'health',message:'SP PLN UIW NTB API aktif'});
    authorize_(e?.parameter?.key || e?.parameter?.api_key || '');
    const name = action.toUpperCase();
    if (!SHEETS.includes(name)) return json_({ok:false,error:'Action tidak dikenal'},400);
    return json_({ok:true,action,data:readSheet_(name,{public:true})});
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function doPost(e) {
  try {
    const body = JSON.parse(e?.postData?.contents || '{}');
    authorize_(body.key || '');
    const action = String(body.action || '').toLowerCase();
    if (action === 'login') return login_(body);
    if (action === 'admin_login') return adminLogin_(body);
    if (action === 'pengaduan') {
      appendRow_('PENGADUAN',[Utilities.getUuid(),body.id_anggota||'',body.kategori||'',body.judul||'',body.isi||'',body.lampiran||'',new Date(),'Diajukan','']);
      return json_({ok:true,message:'Pengaduan berhasil diterima'});
    }
    if (action === 'admin_save') return adminSave_(body);
    return json_({ok:false,error:'Action POST tidak dikenal'},400);
  } catch (err) { return json_({ok:false,error:String(err.message || err)},500); }
}

function login_(body) {
  const id = String(body.id || '').trim();
  const password = String(body.password || '');
  if (!id || !password) return json_({ok:false,error:'ID dan password wajib diisi'},400);
  const member = findMember_(id,password);
  if (!member) return json_({ok:false,error:'ID/NIP atau password salah'},401);
  const safe = {...member}; delete safe.PASSWORD;
  return json_({ok:true,message:'Login berhasil',data:safe});
}

function adminLogin_(body) {
  const id = String(body.id || '').trim();
  const password = String(body.password || '');
  if (!id || !password) return json_({ok:false,error:'ID dan password wajib diisi'},400);
  const member = findMember_(id,password);
  if (!member) return json_({ok:false,error:'ID/NIP atau password salah'},401);
  if (!isAdmin_(member.ID_ANGGOTA, member.NIP)) return json_({ok:false,error:'Akun tidak memiliki akses admin'},403);
  const safe = {...member}; delete safe.PASSWORD;
  return json_({ok:true,message:'Login admin berhasil',data:safe});
}

function adminSave_(body) {
  const admin = findMember_(String(body.id || '').trim(),String(body.password || ''));
  if (!admin || !isAdmin_(admin.ID_ANGGOTA,admin.NIP)) return json_({ok:false,error:'Akses admin ditolak'},403);
  const sheetName = String(body.sheet || '').toUpperCase();
  const op = String(body.op || '').toLowerCase();
  if (!['BERITA','PENGUMUMAN','AGENDA','PENGURUS','DOKUMEN','PENGADUAN','ANGGOTA'].includes(sheetName)) return json_({ok:false,error:'Sheet tidak diizinkan'},400);
  const record = body.record || {};
  if (op === 'append') { appendObject_(sheetName,record); return json_({ok:true,message:'Data ditambahkan'}); }
  if (op === 'update') { updateObject_(sheetName,record); return json_({ok:true,message:'Data diperbarui'}); }
  if (op === 'delete') { deleteObject_(sheetName,record); return json_({ok:true,message:'Data dihapus'}); }
  return json_({ok:false,error:'Operasi admin tidak dikenal'},400);
}

function findMember_(id,password) {
  const rows = readSheet_('ANGGOTA');
  return rows.find(r => (String(r.ID_ANGGOTA||'').trim()===id || String(r.NIP||'').trim()===id) && String(r.PASSWORD||'')===password) || null;
}

function isAdmin_(id,nip) {
  const rows = readSheet_('KONFIGURASI');
  const row = rows.find(r=>String(r.KEY||'').trim().toUpperCase()==='ADMIN_IDS');
  if (!row) return false;
  const ids = String(row.VALUE||'').split(',').map(x=>x.trim()).filter(Boolean);
  return ids.includes(String(id||'').trim()) || ids.includes(String(nip||'').trim());
}

function appendObject_(name,obj) {
  const sheet=getSpreadsheet_().getSheetByName(name); if(!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0].map(h=>String(h).trim());
  sheet.appendRow(headers.map(h=>obj[h]??''));
}
function updateObject_(name,obj) {
  const sheet=getSpreadsheet_().getSheetByName(name); if(!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  const values=sheet.getDataRange().getDisplayValues(); if(values.length<2) throw new Error('Data belum tersedia');
  const headers=values[0].map(h=>String(h).trim());
  const keyHeader=headers.includes('ID_PENGADUAN')?'ID_PENGADUAN':headers.includes('ID_ANGGOTA')?'ID_ANGGOTA':'ID';
  const key=String(obj[keyHeader]||'').trim(); if(!key) throw new Error(`${keyHeader} wajib diisi`);
  const idx=headers.indexOf(keyHeader); const rowIndex=values.slice(1).findIndex(r=>String(r[idx]||'').trim()===key)+2;
  if(rowIndex<2) throw new Error('Data tidak ditemukan');
  sheet.getRange(rowIndex,1,1,headers.length).setValues([headers.map(h=>obj[h]??sheet.getRange(rowIndex,headers.indexOf(h)+1).getValue())]);
}
function deleteObject_(name,obj) {
  const sheet=getSpreadsheet_().getSheetByName(name); if(!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  const values=sheet.getDataRange().getDisplayValues(); if(values.length<2) throw new Error('Data belum tersedia');
  const headers=values[0].map(h=>String(h).trim());
  const keyHeader=headers.includes('ID_PENGADUAN')?'ID_PENGADUAN':headers.includes('ID_ANGGOTA')?'ID_ANGGOTA':'ID';
  const key=String(obj[keyHeader]||'').trim(); const idx=headers.indexOf(keyHeader);
  const rowIndex=values.slice(1).findIndex(r=>String(r[idx]||'').trim()===key)+2;
  if(rowIndex<2) throw new Error('Data tidak ditemukan');
  sheet.deleteRow(rowIndex);
}
function authorize_(supplied) {
  supplied = String(supplied || '');
  if (!API_KEY || API_KEY.indexOf('GANTI_') === 0 || supplied !== API_KEY) throw new Error('Unauthorized / API_KEY belum dikonfigurasi');
}
function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('GANTI_') === 0) throw new Error('SPREADSHEET_ID belum dikonfigurasi');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
function readSheet_(name,options) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h=>String(h).trim());
  return values.slice(1).filter(r=>r.some(v=>String(v).trim()!=='')).map(r=>{
    const out={};
    headers.forEach((h,i)=>{if(!(options?.public && h==='PASSWORD')) out[h]=r[i]??'';});
    return out;
  });
}
function appendRow_(name,row) {
  const sheet=getSpreadsheet_().getSheetByName(name);
  if(!sheet) throw new Error(`Sheet ${name} tidak ditemukan`);
  sheet.appendRow(row);
}
function json_(payload,status) {
  return ContentService.createTextOutput(JSON.stringify({...payload,status:status||200})).setMimeType(ContentService.MimeType.JSON);
}
