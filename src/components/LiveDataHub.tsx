'use client';
import { useState } from 'react';

export default function LiveDataHub() {
  const [weatherDay, setWeatherDay] = useState('Today');

  const stocks = [
    { symbol: 'SENSEX', price: '72,400.15', change: '+120.40', up: true },
    { symbol: 'NIFTY 50', price: '22,040.70', change: '+45.10', up: true },
    { symbol: 'RELIANCE', price: '2,950.00', change: '-12.30', up: false },
    { symbol: 'TCS', price: '4,100.25', change: '+5.60', up: true },
    { symbol: 'HDFC BANK', price: '1,450.80', change: '+8.20', up: true },
    { symbol: 'BTC/INR', price: '₹52,50,000', change: '+2.4%', up: true },
    { symbol: 'ETH/INR', price: '₹2,85,000', change: '-0.8%', up: false },
  ];

  const weatherData = {
    Today: [
      { name: 'DELHI', temp: '32°C', icon: '🌤️', aqi: '145', aqiStatus: 'Moderate', tide: null },
      { name: 'MUMBAI', temp: '29°C', icon: '🌧️', aqi: '85', aqiStatus: 'Good', tide: 'H: 14:30 | L: 08:15' },
      { name: 'KOLKATA', temp: '34°C', icon: '🌩️', aqi: '110', aqiStatus: 'Moderate', tide: 'H: 11:20 | L: 17:45' },
      { name: 'CHENNAI', temp: '31°C', icon: '☁️', aqi: '70', aqiStatus: 'Good', tide: 'H: 09:10 | L: 15:25' },
    ],
    Tomorrow: [
      { name: 'DELHI', temp: '34°C', icon: '☀️', aqi: '160', aqiStatus: 'Poor', tide: null },
      { name: 'MUMBAI', temp: '28°C', icon: '⛈️', aqi: '75', aqiStatus: 'Good', tide: 'H: 15:10 | L: 09:00' },
      { name: 'KOLKATA', temp: '33°C', icon: '☁️', aqi: '95', aqiStatus: 'Good', tide: 'H: 12:00 | L: 18:20' },
      { name: 'CHENNAI', temp: '32°C', icon: '🌤️', aqi: '80', aqiStatus: 'Good', tide: 'H: 10:00 | L: 16:10' },
    ],
    'Day 3': [
      { name: 'DELHI', temp: '35°C', icon: '☀️', aqi: '155', aqiStatus: 'Moderate', tide: null },
      { name: 'MUMBAI', temp: '29°C', icon: '🌦️', aqi: '80', aqiStatus: 'Good', tide: 'H: 16:00 | L: 09:45' },
      { name: 'KOLKATA', temp: '32°C', icon: '🌧️', aqi: '85', aqiStatus: 'Good', tide: 'H: 12:45 | L: 19:00' },
      { name: 'CHENNAI', temp: '33°C', icon: '☀️', aqi: '75', aqiStatus: 'Good', tide: 'H: 10:50 | L: 17:00' },
    ]
  };

  const getAqiColor = (status: string) => {
    if (status === 'Good') return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
    if (status === 'Moderate') return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
  };

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
      <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col gap-8 border border-border shadow-2xl bg-card/80 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Ticker: Stocks & Crypto */}
        <div className="flex bg-background/50 border border-border/50 rounded-xl overflow-hidden h-10 items-center relative z-10">
          <div className="bg-primary px-4 h-full flex items-center shrink-0 shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Markets</span>
          </div>
          <div className="flex-grow overflow-hidden flex items-center group">
            <div className="flex animate-marquee whitespace-nowrap">
              {stocks.map((stock, i) => (
                <div key={i} className="flex items-center gap-2 mx-6 text-[11px] font-bold">
                  <span className="text-foreground/80">{stock.symbol}</span>
                  <span className="text-foreground">{stock.price}</span>
                  <span className={stock.up ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{stock.change}</span>
                </div>
              ))}
              {/* Duplicate for seamless marquee */}
              {stocks.map((stock, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-2 mx-6 text-[11px] font-bold">
                  <span className="text-foreground/80">{stock.symbol}</span>
                  <span className="text-foreground">{stock.price}</span>
                  <span className={stock.up ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{stock.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
          {/* Left: Enhanced Weather (Spans 2 columns on XL) */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 pb-3 gap-4">
              <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <span className="text-lg">🌤️</span> Weather, AQI & Tides
              </h3>
              <div className="flex gap-2 p-1 bg-background/50 rounded-full border border-border/50">
                {['Today', 'Tomorrow', 'Day 3'].map((day) => (
                  <button 
                    key={day}
                    onClick={() => setWeatherDay(day)}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all ${weatherDay === day ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherData[weatherDay as keyof typeof weatherData].map((city) => (
                <div key={city.name} className="flex flex-col bg-background/50 border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">{city.name}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getAqiColor(city.aqiStatus)}`} title={`Air Quality: ${city.aqiStatus}`}>
                      AQI {city.aqi}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <span className="text-3xl drop-shadow-md">{city.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-foreground leading-none">{city.temp}</span>
                    </div>
                  </div>
                  {city.tide ? (
                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-center text-[9px] font-black tracking-widest uppercase text-blue-500/90 dark:text-blue-400">
                      <span title="High Tide">{city.tide.split('|')[0].trim()}</span>
                      <span className="text-foreground/20">|</span>
                      <span title="Low Tide">{city.tide.split('|')[1].trim()}</span>
                    </div>
                  ) : (
                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-center items-center text-[9px] font-black tracking-widest uppercase text-foreground/40">
                      Inland (No Tide)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sports & Horoscope */}
          <div className="flex flex-col gap-6">
            
            {/* Sports Widget */}
            <div className="bg-background/50 border border-border/50 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-colors flex flex-col justify-center min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                  <span className="text-sm">🏏</span> Live Sports
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse border border-red-500/20">Live</span>
              </div>
              <div className="flex justify-between items-center text-center relative z-10">
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 drop-shadow">🇮🇳</span>
                  <span className="text-[11px] font-black tracking-widest text-foreground">IND</span>
                  <span className="text-sm font-black text-foreground mt-1">214/3</span>
                </div>
                <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest bg-background/80 border border-border/50 px-2 py-1 rounded-full">Vs</div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 drop-shadow">🇦🇺</span>
                  <span className="text-[11px] font-black tracking-widest text-foreground">AUS</span>
                  <span className="text-sm font-black text-foreground mt-1">189/8</span>
                </div>
              </div>
              <p className="mt-4 text-[9px] font-bold text-foreground/70 text-center italic border-t border-border/50 pt-3 relative z-10">India needs 12 runs in 8 balls</p>
            </div>

            {/* Horoscope Widget */}
            <div className="bg-background/50 border border-border/50 rounded-2xl p-5 relative overflow-hidden hover:border-primary/30 transition-colors flex flex-col justify-center flex-grow min-h-[140px]">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                  <span className="text-sm">🔮</span> Horoscope
                </span>
                <span className="text-[9px] font-bold text-foreground/40">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">Leo</span>
                </div>
                <p className="text-[11px] text-foreground/80 leading-relaxed font-medium">
                  A sudden insight today could shift your perspective on a long-standing project. Trust your instincts, but verify facts before acting.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
