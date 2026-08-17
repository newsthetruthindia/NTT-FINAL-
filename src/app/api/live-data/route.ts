import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import * as cheerio from 'cheerio';

export const revalidate = 300; // Cache for 5 minutes

const ZODIAC_SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

// Convert 24hr time "14:30" to "2:30 PM"
function to12hr(time24: string): string {
  if (!time24 || time24 === '--:--') return '--:--';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

// Calculate US AQI from PM2.5
function calculateAQI(pm25: number): number {
  if (pm25 < 0) return 0;
  let cLow, cHigh, iLow, iHigh;
  if (pm25 <= 12.0) { cLow = 0; cHigh = 12.0; iLow = 0; iHigh = 50; }
  else if (pm25 <= 35.4) { cLow = 12.1; cHigh = 35.4; iLow = 51; iHigh = 100; }
  else if (pm25 <= 55.4) { cLow = 35.5; cHigh = 55.4; iLow = 101; iHigh = 150; }
  else if (pm25 <= 150.4) { cLow = 55.5; cHigh = 150.4; iLow = 151; iHigh = 200; }
  else if (pm25 <= 250.4) { cLow = 150.5; cHigh = 250.4; iLow = 201; iHigh = 300; }
  else if (pm25 <= 350.4) { cLow = 250.5; cHigh = 350.4; iLow = 301; iHigh = 400; }
  else { cLow = 350.5; cHigh = 500.4; iLow = 401; iHigh = 500; }
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow);
}

export async function GET() {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  if (!WEATHER_API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const cities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'];
  const results: any = { Today: [], Tomorrow: [], 'Day 3': [] };
  const marketData: any = {};
  const horoscopes: any = {};
  const fuelData: any[] = [];

  try {
    // --- 1. Fetch Crypto (CoinGecko) ---
    try {
      const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true');
      const cgData = await cgRes.json();
      marketData.BTC = { price: cgData.bitcoin.inr, change: cgData.bitcoin.inr_24h_change };
      marketData.ETH = { price: cgData.ethereum.inr, change: cgData.ethereum.inr_24h_change };
    } catch(e) { console.error('Crypto error', e); }

    // --- 2. Fetch Stocks (Yahoo Finance) ---
    try {
      const symbols = ['^BSESN', '^NSEI', 'INR=X', 'EURINR=X', 'GC=F'];
      const quotes = await yahooFinance.quote(symbols);
      quotes.forEach((q: any) => {
        marketData[q.symbol] = { price: q.regularMarketPrice, change: q.regularMarketChangePercent };
      });
    } catch(e) { 
      console.error('Yahoo error', e); 
      marketData['^BSESN'] = { price: 72400.15, change: 0.12 };
      marketData['^NSEI'] = { price: 22040.70, change: 0.45 };
      marketData['INR=X'] = { price: 83.15, change: 0.05 };
      marketData['EURINR=X'] = { price: 90.45, change: -0.12 };
      marketData['GC=F'] = { price: 2350.50, change: 0.15 };
    }

    // --- 3. Fetch ALL Horoscopes (parallel) ---
    try {
      const horoPromises = ZODIAC_SIGNS.map(sign =>
        fetch(`https://ohmanda.com/api/horoscope/${sign}`)
          .then(r => r.json())
          .then(d => ({ sign, text: d.horoscope }))
          .catch(() => ({ sign, text: null }))
      );
      const horoResults = await Promise.all(horoPromises);
      horoResults.forEach(({ sign, text }) => {
        if (text) horoscopes[sign] = text;
      });
    } catch(e) { console.error('Horoscope error', e); }

    // --- 4. Fetch Fuel Prices (scrape GoodReturns) ---
    try {
      const fuelCities: { [key: string]: { petrol: string; diesel: string } } = {
        'Delhi': { petrol: '₹102.12', diesel: '₹95.20' },
        'Mumbai': { petrol: '₹111.21', diesel: '₹97.83' },
        'Kolkata': { petrol: '₹113.51', diesel: '₹99.82' },
        'Chennai': { petrol: '₹107.77', diesel: '₹99.55' },
      };

      // Try scraping petrol prices from JSON-LD
      try {
        const petrolRes = await fetch('https://www.goodreturns.in/petrol-price.html', {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const petrolHtml = await petrolRes.text();
        const $p = cheerio.load(petrolHtml);
        
        $p('script[type="application/ld+json"]').each((_, el) => {
          try {
            const json = JSON.parse($p(el).html() || '');
            if (json['@type'] === 'FAQPage' && json.mainEntity) {
              json.mainEntity.forEach((faq: any) => {
                const q = faq.name || '';
                const a = faq.acceptedAnswer?.text || '';
                for (const city of Object.keys(fuelCities)) {
                  if (q.includes(city) || a.includes(city)) {
                    const match = a.match(/(?:Rs\.?|₹)\s*([\d,.]+)/);
                    if (match) {
                      fuelCities[city].petrol = '₹' + match[1].replace(/[.,]+$/, '');
                    }
                  }
                }
              });
            }
          } catch {}
        });
      } catch(e) { console.error('Petrol scrape error', e); }

      // Try scraping diesel prices from JSON-LD
      try {
        const dieselRes = await fetch('https://www.goodreturns.in/diesel-price.html', {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const dieselHtml = await dieselRes.text();
        const $d = cheerio.load(dieselHtml);
        
        $d('script[type="application/ld+json"]').each((_, el) => {
          try {
            const json = JSON.parse($d(el).html() || '');
            if (json['@type'] === 'FAQPage' && json.mainEntity) {
              json.mainEntity.forEach((faq: any) => {
                const q = faq.name || '';
                const a = faq.acceptedAnswer?.text || '';
                for (const city of Object.keys(fuelCities)) {
                  if (q.includes(city) || a.includes(city)) {
                    const match = a.match(/(?:Rs\.?|₹)\s*([\d,.]+)/);
                    if (match) {
                      fuelCities[city].diesel = '₹' + match[1].replace(/[.,]+$/, '');
                    }
                  }
                }
              });
            }
          } catch {}
        });
      } catch(e) { console.error('Diesel scrape error', e); }

      for (const [city, prices] of Object.entries(fuelCities)) {
        fuelData.push({ city: city.toUpperCase(), petrol: prices.petrol, diesel: prices.diesel });
      }
    } catch(e) {
      console.error('Fuel error', e);
      fuelData.push(
        { city: 'DELHI', petrol: '₹102.12', diesel: '₹95.20' },
        { city: 'MUMBAI', petrol: '₹111.21', diesel: '₹97.83' },
        { city: 'KOLKATA', petrol: '₹113.51', diesel: '₹99.82' },
        { city: 'CHENNAI', petrol: '₹107.77', diesel: '₹99.55' },
      );
    }

    // --- 5. Fetch Weather & Tides ---
    for (const city of cities) {
      const forecastRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}, India&days=3&aqi=yes`);
      const forecastData = await forecastRes.json();

      let tideData: any = null;
      if (city !== 'Delhi') {
        const marineRes = await fetch(`http://api.weatherapi.com/v1/marine.json?key=${WEATHER_API_KEY}&q=${city}, India&days=3`);
        const marineJson = await marineRes.json();
        tideData = marineJson?.forecast?.forecastday;
      }

      forecastData?.forecast?.forecastday?.forEach((day: any, index: number) => {
        let dayKey = 'Today';
        if (index === 1) dayKey = 'Tomorrow';
        if (index === 2) dayKey = 'Day 3';

        let aqiStatus = 'Good';
        const epaIndex = day.day.air_quality?.['us-epa-index'] || 1;
        if (epaIndex >= 3 && epaIndex <= 4) aqiStatus = 'Moderate';
        if (epaIndex >= 5) aqiStatus = 'Poor';

        let tideStr = null;
        if (tideData && tideData[index]?.day?.tides?.[0]?.tide) {
          const tides = tideData[index].day.tides[0].tide;
          const formatTime = (tStr: string) => {
            if (!tStr) return '--';
            const date = new Date(tStr);
            let h = date.getHours();
            const m = date.getMinutes();
            const period = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            const hour12 = h ? h : 12;
            return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
          };
          
          const firstHigh = tides.find((t: any) => t.tide_type === 'HIGH');
          const firstLow = tides.find((t: any) => t.tide_type === 'LOW');
          
          const highTime = firstHigh ? formatTime(firstHigh.tide_time) : '--';
          const lowTime = firstLow ? formatTime(firstLow.tide_time) : '--';
          tideStr = `H: ${highTime} | L: ${lowTime}`;
        }

        let aqiValue = 'N/A';
        const pm25 = index === 0 ? forecastData.current.air_quality?.['pm2_5'] : day.day.air_quality?.['pm2_5'];
        if (pm25) {
          aqiValue = calculateAQI(pm25).toString();
        }

        const tempC = index === 0 ? forecastData.current.temp_c : day.day.avgtemp_c;

        results[dayKey].push({
          name: city.toUpperCase(),
          temp: `${Math.round(tempC)}°C`,
          icon: day.day.condition.text.includes('Rain') ? '🌧️' : day.day.condition.text.includes('Cloud') ? '☁️' : '☀️',
          aqi: aqiValue,
          aqiStatus,
          tide: tideStr,
        });
      });
    }

    return NextResponse.json({ weatherData: results, marketData, horoscopes, fuelData });
  } catch (error) {
    console.error('Error fetching live data:', error);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
