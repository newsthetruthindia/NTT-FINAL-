'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TVMonitor() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://backend.newsthetruth.com/api/v1/monitor/${token}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh data every minute
        return () => clearInterval(interval);
    }, [token]);

    if (loading) return <div className="bg-black h-screen w-screen flex items-center justify-center text-white font-mono uppercase tracking-widest animate-pulse">Initializing News Matrix...</div>;
    if (error) return <div className="bg-black h-screen w-screen flex flex-col items-center justify-center text-white font-mono uppercase tracking-widest">
        <div className="text-red-600 mb-4 animate-bounce">Access Denied</div>
        <div className="text-[10px] opacity-40">Invalid or Expired Monitor Token</div>
    </div>;

    return (
        <div className="bg-black text-white overflow-hidden" style={{ height: '100vh', width: '100vw' }}>
            <style jsx global>{`
                body { margin: 0; padding: 0; background: black; overflow: hidden; }
                .video-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    height: 80vh;
                    gap: 2px;
                    padding: 2px;
                }
                .rss-matrix {
                    height: 20vh;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .rss-row {
                    height: 16%;
                    background: #dadada;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .rss-label {
                    background: #222;
                    color: white;
                    padding: 0 15px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-size: 0.8vw;
                    font-weight: 900;
                    min-width: 10vw;
                }
                .marquee {
                    white-space: nowrap;
                    display: inline-block;
                    animation: scroll 60s linear infinite;
                    padding-left: 20px;
                }
                @keyframes scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>

            {/* Matrix */}
            <div className="video-grid">
                {[...Array(12)].map((_, i) => {
                    const id = data?.youtube_ids?.[i];
                    return (
                        <div key={i} className="relative bg-neutral-900 overflow-hidden border border-white/5">
                             <div style={{ paddingTop: '56.25%', position: 'relative' }}>
                                {id ? (
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1`} 
                                        className="absolute inset-0 w-full h-full" 
                                        frameBorder="0" 
                                        allow="autoplay; encrypted-media" 
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[0.8vw] tracking-[0.5em] uppercase font-mono">
                                        No Signal
                                    </div>
                                )}
                             </div>
                        </div>
                    );
                })}
            </div>

            {/* RSS Strip */}
            <div className="rss-matrix">
                {[...Array(6)].map((_, f) => {
                    const headlines = data?.rss_feeds?.[f] || [];
                    return (
                        <div key={f} className="rss-row">
                            <div className="rss-label">F_0{f+1}</div>
                            <div className="flex-grow overflow-hidden">
                                <div className="marquee" style={{ animationDuration: `${50 + (f * 10)}s` }}>
                                    {headlines.length > 0 ? (
                                        [...headlines, ...headlines].map((h, hi) => (
                                            <span key={hi} className="text-black font-bold text-[1.1vw] mx-10">
                                                ● {h.title}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-neutral-500 italic text-[0.8vw] tracking-widest px-4 uppercase">Initializing data link port 0{f+1}...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
