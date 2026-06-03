const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fTKLTpThQDb3ZufmpB1hkDE-bzHi-agF5kjGTFD7c4w/gviz/tq?tqx=out:json';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Lee números del Google Sheet
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    // Google devuelve JSONP, hay que limpiarlo
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;
