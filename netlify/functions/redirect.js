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
    const rows = await sheet.getCells({ 'min-row': 1, 'max-row': 3, 'min-col': 2, 'max-col': 2 });

    // 2. LEER NÚMEROS DE A2 Y A3
    const numeroA2 = rows[1][0]?.value?.toString().trim() || 'VACIO';
    const numeroA3 = rows[2][0]?.value?.toString().trim() || 'VACIO';

    // 3. ROTAR CADA 5 SEGUNDOS
    const segundos = Math.floor(Date.now
