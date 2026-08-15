'use client';
import { useState, useEffect } from 'react';

export default function LiveDataHub() {
  const [weatherDay, setWeatherDay] = useState('Today');

  const [weatherData, setWeatherData] = useState<any>({ Today: [], Tomorrow: [], 'Day 3': [] });
  const [marketData, setMarketData] = useState<any>(null);
  const [horoscope, setHoroscope] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/live-data')
      .then(res => res.json())
      .then(data => {
        if (data.weatherData) setWeatherData(data.weatherData);
        if (data.marketData) setMarketData(data.marketData);
        if (data.horoscope) setHoroscope(data.horoscope);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (obj: any, prefix = '') => obj?.price ? prefix + obj.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '--';
  const formatChange = (obj: any) => obj?.change ? (obj.change > 0 ? '+' : '') + obj.change.toFixed(2) + '%' : '--';

  const stocks = marketData ? [
    { symbol: 'SENSEX', price: formatPrice(marketData['^BSESN']), change: formatChange(marketData['^BSESN']), up: marketData['^BSESN']?.change >= 0 },
    { symbol: 'NIFTY 50', price: formatPrice(marketData['^NSEI']), change: formatChange(marketData['^NSEI']), up: marketData['^NSEI']?.change >= 0 },
    { symbol: 'GOLD', price: formatPrice(marketData['GC=F'], '$'), change: formatChange(marketData['GC=F']), up: marketData['GC=F']?.change >= 0 },
    { symbol: 'USD/INR', price: formatPrice(marketData['INR=X'], '₹'), change: formatChange(marketData['INR=X']), up: marketData['INR=X']?.change >= 0 },
    { symbol: 'BTC/INR', price: formatPrice(marketData['BTC'], '₹'), change: formatChange(marketData['BTC']), up: marketData['BTC']?.change >= 0 },
    { symbol: 'ETH/INR', price: formatPrice(marketData['ETH'], '₹'), change: formatChange(marketData['ETH']), up: marketData['ETH']?.change >= 0 },
  ] : [
    { symbol: 'Loading Markets...', price: '', change: '', up: true }
  ];



  const fuelData = [
    { city: 'DELHI', petrol: '₹94.72', diesel: '₹87.62' },
    { city: 'MUMBAI', petrol: '₹104.21', diesel: '₹92.15' },
    { city: 'KOLKATA', petrol: '₹103.94', diesel: '₹90.76' },
    { city: 'CHENNAI', petrol: '₹100.75', diesel: '₹92.34' },
  ];

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
        
        {/* Top Ticker: Stocks, Gold, Forex, Crypto */}
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
          {/* Left Column (Spans 2 columns on XL): Weather & Fuel */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Weather & AQI Section */}
            <div className="flex flex-col gap-4">
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
                {loading ? (
                  <div className="col-span-full py-12 flex justify-center items-center text-primary font-bold animate-pulse">
                    Fetching Live Data...
                  </div>
                ) : weatherData[weatherDay]?.map((city: any) => (
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

            {/* Fuel Prices Section */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <span className="text-lg">⛽</span> Fuel Prices (Today)
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {fuelData.map((fuel) => (
                  <div key={fuel.city} className="flex flex-col bg-background/50 border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60 mb-4">{fuel.city}</span>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Petrol</span>
                      <span className="text-sm font-black text-foreground">{fuel.petrol}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border/50 pt-2">
                      <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Diesel</span>
                      <span className="text-sm font-black text-foreground">{fuel.diesel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sports & Horoscope */}
          <div className="flex flex-col gap-6">
            
            {/* Sports Widget */}
            <div className="bg-background/50 border border-border/50 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-colors flex flex-col justify-center min-h-[160px]">
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
            <div className="bg-background/50 border border-border/50 rounded-2xl p-5 relative overflow-hidden hover:border-primary/30 transition-colors flex flex-col justify-center flex-grow min-h-[160px]">
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
                {loading ? (
                  <p className="text-[11px] text-foreground/40 animate-pulse font-medium">Stargazing...</p>
                ) : (
                  <p className="text-[11px] text-foreground/80 leading-relaxed font-medium">
                    {horoscope || "A sudden insight today could shift your perspective on a long-standing project. Trust your instincts, but verify facts before acting."}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
