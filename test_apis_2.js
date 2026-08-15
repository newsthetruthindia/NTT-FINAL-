const yahooFinance = require('yahoo-finance2').default;
const cheerio = require('cheerio');

async function test() {
  console.log("Testing Yahoo Finance...");
  try {
    const quote = await yahooFinance.quote('^BSESN');
    console.log("Sensex:", quote.regularMarketPrice, quote.regularMarketChange);
  } catch (e) { console.error("Yahoo error:", e); }

  console.log("Testing Fuel Scraper...");
  try {
    const res = await fetch('https://www.goodreturns.in/petrol-price.html');
    const html = await res.text();
    const $ = cheerio.load(html);
    const delhiPetrol = $('a:contains("Delhi")').closest('tr').find('td').eq(1).text().trim();
    console.log("Delhi Petrol:", delhiPetrol);
  } catch(e) { console.error("Scraper error:", e); }

  console.log("Testing Ohmanda Horoscope...");
  try {
    const res = await fetch('https://ohmanda.com/api/horoscope/leo');
    const data = await res.json();
    console.log("Leo:", data.horoscope);
  } catch(e) { console.error("Horoscope error:", e); }
}
test();
