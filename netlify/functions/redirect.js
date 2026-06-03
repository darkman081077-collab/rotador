const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async function() {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const sheetId = process.env.SHEET_ID;

  const auth = new JWT({
    email: email,
    key: key.split('\\n').join('\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.loadCells('B2:B3');
  const num1 = sheet.getCell(1, 1).value;
  const num2 = sheet.getCell(2, 1).value;

  const seg = Math.floor(Date.now() / 1000);
  let num;
  if (seg % 2 === 0) {
    num = num1;
  } else {
    num = num2;
  }

  return {
    statusCode: 302,
    headers: { Location: 'https://wa.me/' + num }
  };
};
