exports.handler = async (event, context) => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w/gviz/tq?tqx=out:json';

  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // A2 = rows[1], A3 = rows[2] porque fila 0 son títulos
    let num1 = String(rows[1]?.c[0]?.v || '5491157714571');
    let num2 = String(rows[2]?.c[0]?.v || '5491172345929');

    // Limpiar por las dudas
    num1 = num1.replace(/\D/g, '');
    num2 = num2.replace(/\D/g, '');

    // Rotación 50/50 por segundos
    const seconds = new Date().getSeconds();
    const target = seconds < 30? num1 : num2;

    return {
      statusCode: 302,
      headers: {
        Location: `https://wa
