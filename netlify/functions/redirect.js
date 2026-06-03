const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async function() {
  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.split('\\n').join('\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  // CAMBIO CLAVE: ahora lee A2 y A3 en vez de B2 y B3
  await sheet.loadCells('A2:A3');
  const num1 = sheet.getCell(1, 0).value || '5491125603730';
  const num2 = sheet.getCell(2, 0).value || '5491172345929';

  // Rota cada 5 segundos
  const seg = Math.floor(Date.now() / 1000);
  const numero = seg % 2 === 0? num1 : num2;

  return {
    statusCode: 302,
    headers: { Location: 'https://wa.me/' + numero }
  };
};
