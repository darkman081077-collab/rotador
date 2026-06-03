const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async function(event) {
  try {
    // 1. LEER VARIABLES DE NETLIFY
    const sheetId = process.env.SHEET_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    // 2. ARREGLAR LA KEY - Netlify guarda \n como texto
    const cleanKey = privateKey.split('\\n').join('\n');

    // 3. CONECTAR A GOOGLE SHEETS
    const auth = new JWT({
      email: clientEmail,
      key: cleanKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 4. LEER B2 Y B3 - Acá cambiás los números en el Sheet
    await sheet.loadCells('B2:B3');
    let num1 = sheet.getCell(1, 1).value;
    let num2 = sheet.getCell(2, 1).value;

    // Si están vacías, pone esto de respaldo
    if (!num1) num1 = '5491125603730';
    if (!num2) num2 = '54911XXXXXXXX';

    // 5. ROTAR CADA 5 SEGUNDOS
    const segundos = Math.floor(Date.now() / 1000);
    let numeroFinal;
    if (segundos % 2 === 0) {
      numeroFinal = num1;
    } else {
      numeroFinal = num2;
    }

    // 6. REDIRIGIR A WHATSAPP
    return {
      statusCode: 302,
      headers: {
        Location: 'https://wa.me/' + numeroFinal
      }
    };

  } catch (error) {
    // Si algo falla, te muestra el error en pantalla
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'ERROR: ' + error.message
    };
  }
};
