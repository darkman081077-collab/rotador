export default async (req) => {
  const SHEET_ID = '1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w';
  const API_KEY = 'AIzaSyBiJv9G91lTfhzMuwm7WDS8fWi4DiCJ-CU';

  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!`;
  
  try {
    const links = (await fetch(base + `A2:A3?key=${API_KEY}`).then(r=>r.json())).values.flat();
    let contador = 0;
    try {
      const cont = await fetch(base + `B2?key=${API_KEY}`).then(r=>r.json());
      contador = parseInt(cont.values[0][0]) || 0;
    } catch(e) {}
    
    const link = links[contador % 2];
    
    await fetch(base + `B2?valueInputOption=RAW&key=${API_KEY}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[contador + 1]] })
    });

    return Response.redirect(link, 302);
  } catch (e) {
    return Response.redirect('https://wa.me/541157714571', 302);
  }
}
