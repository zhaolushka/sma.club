function getJoinSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Join');
  if (!sheet) sheet = ss.getSheets()[0];
  const headers = ['Date', 'Name', 'Phone', 'Group', 'Course', 'Role'];
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== 'Date') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readJoinData(e) {
  if (!e) return {};
  if (e.parameter && (e.parameter.name || e.parameter.phone)) return e.parameter;
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return e.parameter || {};
    }
  }
  return {};
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = readJoinData(e);
  const name = String(data.name || '').trim().slice(0, 80);
  const phone = String(data.phone || '').replace(/\D/g, '').slice(0, 15);
  const group = String(data.group || '').trim().slice(0, 40);
  const course = String(data.course || '').trim().slice(0, 40);
  const role = data.role === 'teacher' ? 'teacher' : 'member';
  if (!name || phone.length < 11 || !group || !course) return json_({ ok: false });

  const sheet = getJoinSheet();
  const last = sheet.getLastRow();
  if (last >= 2) {
    const prevPhone = String(sheet.getRange(last, 3).getValue()).replace(/\D/g, '');
    if (prevPhone === phone) return json_({ ok: true, dup: true });
  }

  sheet.appendRow([
    data.date || new Date().toISOString(),
    name,
    phone.length === 11 ? `+${phone}` : data.phone || '',
    group,
    course,
    role,
  ]);
  return json_({ ok: true });
}

function doGet() {
  return ContentService.createTextOutput('ok');
}
