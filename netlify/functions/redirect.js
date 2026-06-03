exports.handler = async (event, context) => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w/gviz/tq?tqx=out:json';

  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    let num1 = String(rows[1]?.c[1]?.v || '');
    let num2 = String(rows[2]?.c[1]?.v || '');
    let counter = parseInt(rows[1]?.c[2]?.v || '0');

    num1 = num1.replace('https://wa.me/', '').replace(/\D/g, '');
    num2 = num2.replace('https://wa.me/', '').replace(/\D/g, '');

    const target = counter % 2 === 0? num1 : num2;
    counter++;

    return {
      statusCode: 302,
      headers: {
        Location: `https://wa.me/${target}`
      }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error: ' + error.message
    };
  }
};
