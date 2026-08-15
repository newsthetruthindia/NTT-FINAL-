import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  if (!WEATHER_API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const cities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'];
  const results: any = { Today: [], Tomorrow: [], 'Day 3': [] };

  try {
    for (const city of cities) {
      // 1. Fetch Forecast (for Weather and AQI)
      const forecastRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=3&aqi=yes`);
      const forecastData = await forecastRes.json();

      // 2. Fetch Marine (for Tides) - Only for coastal cities
      let tideData: any = null;
      if (city !== 'Delhi') {
        const marineRes = await fetch(`http://api.weatherapi.com/v1/marine.json?key=${WEATHER_API_KEY}&q=${city}&days=3`);
        const marineJson = await marineRes.json();
        tideData = marineJson?.forecast?.forecastday;
      }

      // 3. Format Data
      forecastData?.forecast?.forecastday?.forEach((day: any, index: number) => {
        let dayKey = 'Today';
        if (index === 1) dayKey = 'Tomorrow';
        if (index === 2) dayKey = 'Day 3';

        // Map AQI US-EPA index (1-6) to Good/Moderate/Poor
        let aqiStatus = 'Good';
        const epaIndex = day.day.air_quality?.['us-epa-index'] || 1;
        if (epaIndex >= 3 && epaIndex <= 4) aqiStatus = 'Moderate';
        if (epaIndex >= 5) aqiStatus = 'Poor';

        // Extract High/Low Tide
        let tideStr = null;
        if (tideData && tideData[index]) {
          const tides = tideData[index].day.tides?.[0]?.tide || [];
          const high = tides.find((t: any) => t.tide_type === 'HIGH')?.tide_time.split(' ')[1] || '--:--';
          const low = tides.find((t: any) => t.tide_type === 'LOW')?.tide_time.split(' ')[1] || '--:--';
          tideStr = `H: ${high} | L: ${low}`;
        }

        results[dayKey].push({
          name: city.toUpperCase(),
          temp: `${Math.round(day.day.avgtemp_c)}°C`,
          icon: day.day.condition.text.includes('Rain') ? '🌧️' : day.day.condition.text.includes('Cloud') ? '☁️' : '☀️',
          aqi: day.day.air_quality?.['pm2_5'] ? Math.round(day.day.air_quality['pm2_5']) : 'N/A',
          aqiStatus,
          tide: tideStr,
        });
      });
    }

    return NextResponse.json({ weatherData: results });
  } catch (error) {
    console.error('Error fetching live data:', error);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
