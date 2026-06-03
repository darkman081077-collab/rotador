const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
  try {
    // 1. ARREGLAR LA KEY
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const cleanKey = privateKey.split('\\n').join('\n');

    // 2. CONECTAR A SHEETS
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: cleanKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 3. LEER B2 Y B3
    await sheet.loadCells('B1:B3');
    let numeroA2 = sheet.getCell(1, 1).value;
    let numeroA3 = sheet.getCell(2, 1).value;

    if (!numeroA2) numeroA2 = 'VACIO';
    if (!numeroA3) numeroA3 = 'VACIO';

    // 4. ROTAR CADA 5 SEG - SIN TERNARIO
    const segundos = Math.floor(Date.now() / 1000);
    let turno;
    if (segundos % 2 === 0) {
      turno = numeroA2;
    } else {
      turno = numeroA3;
    }

    // 5. DEBUG
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: '=== DEBUG ROTADOR ===\n' +
            'A2 Sheet: ' + numeroA2 + '\n' +
            'A3 Sheet: ' + numeroA3 + '\n' +
            'Segundos: ' + segundos + '\n' +
            'Turno: ' + turno + '\n' +
            'URL: https://wa.me/' + turno
    };

  } catch (error) {
    return {
      statusCode: 500,
