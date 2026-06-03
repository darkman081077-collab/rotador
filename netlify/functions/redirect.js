exports.handler = async (event, context) => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w/gviz/tq?tqx=out:json';

  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // A2 = rows[1], A3 = rows[2] porque fila 1 son títulos
    let link1 = String(rows[1]?.c[0]?.v || '');
    let link2 = String(rows[2]?.c[0]?.v || '');

    // Limpiar: sacamos todo menos números
    let num1 = link1.replace(/\D/g, '');
    let num2 = link2.replace(/\D/g, '');

    // Rota cada 30 segundos: 0-29 = A2, 30-59 = A3
    const seconds = new Date().getSeconds();
    const target = seconds < 30? num1 : num2;

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
