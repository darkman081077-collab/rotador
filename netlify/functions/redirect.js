exports.handler = async (event, context) => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w/gviz/tq?tqx=out:json';

  try {
    // Lee números del Google Sheet
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    // Google devuelve JSONP, hay que limpiarlo
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // A2 = rows[1].c[1].v A3 = rows[2].c[1].v B2 = rows[1].c[2].v
    let num1 = rows[1]?.c[1]?.v || '';
    let num2 = rows[2]?.c[1]?.v || '';
    let counter = parseInt(rows[1]?.c[2]?.v || '0');

    // Limpia el "https://wa.me/"
    num1 = num1.replace('https://wa.me/', '');
    num2 = num2.replace('https://wa.me/', '');

    // Rota: par = num1, impar = num2
    const target = counter % 2 === 0? num1 : num2;

    // Suma 1 al contador para la próxima visita
    counter++;

    // Redirige al WhatsApp - formato Netlify
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
