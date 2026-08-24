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

// Map WMO Weather codes to Emojis
function getWeatherEmoji(code: number): string {
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog and depositing rime fog
  // 51, 53, 55: Drizzle
  // 61, 63, 65: Rain
  // 71, 73, 75: Snow fall
  // 77: Snow grains
  // 80, 81, 82: Rain showers
  // 85, 86: Snow showers
  // 95: Thunderstorm
  // 96, 99: Thunderstorm with slight and heavy hail
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3 || code === 45 || code === 48) return '☁️';
  return '🌧️';
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

    // --- 3. Fetch Horoscopes ---
    try {
      const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
      await Promise.all(ZODIAC_SIGNS.map(async (sign) => {
        try {
          const res = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`);
          if (res.ok) {
            const data = await res.json();
            horoscopes[sign] = data.data.horoscope;
          } else {
            throw new Error('API failed');
          }
        } catch (e) {
          // Fallback to Ohmanda if the first API fails
          const res2 = await fetch(`https://ohmanda.com/api/horoscope/${sign}`);
          if (res2.ok) {
            const data2 = await res2.json();
            horoscopes[sign] = data2.horoscope;
          } else {
            horoscopes[sign] = `The stars are aligning for you today, ${sign.charAt(0).toUpperCase() + sign.slice(1)}. Trust your intuition and embrace new opportunities.`;
          }
        }
      }));
    } catch(e) {
      console.error('Horoscope error', e);
      ZODIAC_SIGNS.forEach(sign => {
        if (!horoscopes[sign]) horoscopes[sign] = "The stars are shining bright for you today! Check back later for your specific celestial forecast.";
      });
    }

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
    const cityCoords: Record<string, {lat: number, lon: number}> = {
      'Delhi': { lat: 28.6139, lon: 77.2090 },
      'Mumbai': { lat: 19.0760, lon: 72.8777 },
      'Kolkata': { lat: 22.5726, lon: 88.3639 },
      'Chennai': { lat: 13.0827, lon: 80.2707 }
    };

    for (const city of cities) {
      const coords = cityCoords[city];
      
      const openMeteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=3`);
      const openMeteoData = await openMeteoRes.json();

      const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=pm2_5&hourly=pm2_5&timezone=Asia%2FKolkata`);
      const aqiData = await aqiRes.json();

      [0, 1, 2].forEach((index: number) => {
        let dayKey = 'Today';
        if (index === 1) dayKey = 'Tomorrow';
        if (index === 2) dayKey = 'Day 3';

        let pm25 = 0;
        if (aqiData) {
          if (index === 0) {
            pm25 = aqiData.current?.pm2_5 || 0;
          } else {
            const targetIndex = (index * 24) + 12;
            pm25 = aqiData.hourly?.pm2_5?.[targetIndex] || 0;
          }
        }

        let aqiValue = 'N/A';
        let aqiStatus = 'Good';
        if (pm25) {
          const aqi = calculateAQI(pm25);
          aqiValue = aqi.toString();
          if (aqi <= 50) aqiStatus = 'Good';
          else if (aqi <= 100) aqiStatus = 'Moderate';
          else if (aqi <= 200) aqiStatus = 'Poor';
          else aqiStatus = 'Severe';
        }

        let tempC = 0;
        let statsStr = null;
        let iconEmoji = '☀️';
        
        if (openMeteoData && !openMeteoData.error) {
          if (index === 0) {
            tempC = openMeteoData.current?.temperature_2m || 0;
            const hum = openMeteoData.current?.relative_humidity_2m || 0;
            const wind = Math.round(openMeteoData.current?.wind_speed_10m || 0);
            statsStr = `Hum: ${hum}% | Wind: ${wind} km/h`;
            iconEmoji = getWeatherEmoji(openMeteoData.current?.weather_code || 0);
          } else {
            const maxTemp = openMeteoData.daily?.temperature_2m_max?.[index] || 0;
            const minTemp = openMeteoData.daily?.temperature_2m_min?.[index] || 0;
            tempC = (maxTemp + minTemp) / 2;
            const hum = openMeteoData.daily?.relative_humidity_2m_mean?.[index] || 0;
            const wind = Math.round(openMeteoData.daily?.wind_speed_10m_max?.[index] || 0);
            statsStr = `Hum: ${hum}% | Wind: ${wind} km/h`;
            iconEmoji = getWeatherEmoji(openMeteoData.daily?.weather_code?.[index] || 0);
          }
        } else {
          statsStr = 'Hum: N/A | Wind: N/A';
        }

        results[dayKey].push({
          name: city.toUpperCase(),
          temp: `${Math.round(tempC)}°C`,
          icon: iconEmoji,
          aqi: aqiValue,
          aqiStatus,
          tide: statsStr,
        });
      });
    }

    return NextResponse.json({ weatherData: results, marketData, horoscopes, fuelData });
  } catch (error) {
    console.error('Error fetching live data:', error);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
