const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
  try {
    // 1. CONECTAR A GOOGLE SHEETS
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // FIX: getCells necesita objeto, no string
    await sheet.loadCells('B1:B3');
    const numeroA2 = sheet.getCell(1, 1).value?.toString().trim() || 'VACIO';
    const numeroA3 = sheet.getCell(2, 1).value?.toString().trim() || 'VACIO';

    // 2. ROTAR CADA 5 SEGUNDOS
    const segundos = Math.floor(Date.now() / 1000);
    const turno = (segundos % 2 === 0)? numeroA2 : numeroA3;

    // 3. DEBUG: MOSTRAR QUÉ LEE
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: `=== DEBUG ROTADOR ===
A2 Sheet: ${numeroA2}
A3 Sheet: ${numeroA3}
Segundos: ${segundos}
Turno actual: ${turno}
URL WhatsApp: https://wa.me/${turno}`
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `ERROR: ${error.message}`
    };
  }
};
