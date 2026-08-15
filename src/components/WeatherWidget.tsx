'use client';

export default function WeatherWidget() {
  const cities = [
    { name: 'DELHI', temp: '32°C', icon: '🌤️', status: 'Partly Cloudy', tide: null },
    { name: 'MUMBAI', temp: '29°C', icon: '🌧️', status: 'Light Rain', tide: 'H: 14:30 | L: 08:15' },
    { name: 'KOLKATA', temp: '34°C', icon: '🌩️', status: 'Storms', tide: 'H: 11:20 | L: 17:45' },
    { name: 'CHENNAI', temp: '31°C', icon: '☁️', status: 'Overcast', tide: 'H: 09:10 | L: 15:25' },
  ];

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
      <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-border shadow-2xl relative overflow-hidden bg-card/80">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="shrink-0 flex flex-col gap-2 relative z-10 text-center lg:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 justify-center lg:justify-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Metros
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">
            Weather <br className="hidden lg:block"/> <span className="text-primary font-serif">& Tides</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full relative z-10">
          {cities.map((city) => (
            <div key={city.name} className="flex flex-col bg-background/50 border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60 mb-2">{city.name}</span>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl drop-shadow-md">{city.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-foreground leading-none">{city.temp}</span>
                  <span className="text-[9px] font-bold text-foreground/70 uppercase tracking-wider mt-1">{city.status}</span>
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
    </section>
  );
}
