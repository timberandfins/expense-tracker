/**
 * Google Apps Script backend for Expense Tracker
 *
 * Setup:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the contents of Code.gs with this file
 * 4. Click Deploy > New Deployment > Web app
 * 5. Set "Execute as" to "Me" and "Who has access" to "Anyone"
 * 6. Copy the Web App URL into the Expense Tracker app
 *
 * Important: After making changes, you must create a NEW deployment
 * (not just save). Each deployment gets a unique URL.
 */

/**
 * Handles POST requests from the Expense Tracker app.
 * Data is sent as JSON in the request body with Content-Type: text/plain.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendExpense(data);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests. Used as a fallback and for connection testing.
 * When called without a "data" parameter, returns a status check response.
 */
function doGet(e) {
  try {
    if (e.parameter.data) {
      var data = JSON.parse(e.parameter.data);
      appendExpense(data);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // No data parameter — treat as a connection test
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Expense Tracker API is running' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Appends an expense row to the active sheet.
 * Creates a header row if the sheet is empty.
 */
function appendExpense(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Add header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Date',
      'Vendor',
      'Description',
      'Category',
      'Payment Method',
      'Province',
      'Subtotal',
      'Tax 1 (GST/HST)',
      'Tax 2 (PST/QST)',
      'Total',
      'Notes',
      'Timestamp'
    ]);
  }

  sheet.appendRow([
    data.date || '',
    data.vendor || '',
    data.description || '',
    data.category || '',
    data.paymentMethod || '',
    data.province || '',
    data.subtotal || 0,
    data.tax1 || 0,
    data.tax2 || 0,
    data.total || 0,
    data.notes || '',
    new Date()
  ]);
}
