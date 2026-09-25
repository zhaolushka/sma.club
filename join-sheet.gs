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

function doPost(e) {
  const data = readJoinData(e);
  getJoinSheet().appendRow([
    data.date || new Date().toISOString(),
    data.name || '',
    data.phone || '',
    data.group || '',
    data.course || '',
    data.role || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('ok');
}
