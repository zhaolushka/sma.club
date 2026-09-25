function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Name', 'Phone', 'Group', 'Course', 'Role']);
  }
  sheet.appendRow([
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
