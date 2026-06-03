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

    // 2. LEER NÚMEROS DE A2 Y A3 - VOS LOS CAMBIÁS ACÁ EN EL SHEET
    // A2 = número 1 | A3 = número 2 | Siempre con 549 adelante
    const numeroA2 = rows[1][0]?.value || '';
    const numeroA3 = rows[2][0]?.value || '';

    // 3. ROTAR CADA 5 SEGUNDOS
    const segundos = Math.floor(Date.now() / 1000);
    const turno = segundos % 2 === 0? numeroA2 : numeroA3;

    // 4. REDIRIGIR A WHATSAPP - SIN 549 DUPLICADO
    return {
      statusCode: 302,
      headers: {
        Location: `https://wa.me/${turno}`
      }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
