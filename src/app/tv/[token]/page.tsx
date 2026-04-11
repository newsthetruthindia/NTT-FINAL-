'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TVMonitor() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadCount, setLoadCount] = useState(0); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://backend.newsthetruth.com/api/v1/monitor/${token}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
                setLoading(false);

                // Start Sequential Load Waterfall
                let current = 0;
                const waterfall = setInterval(() => {
                    current++;
                    setLoadCount(current);
                    if (current >= 12) clearInterval(waterfall);
                }, 400); // 400ms delay per screen to protect TV processor
            } catch (err) {
                console.error(err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); 
        return () => clearInterval(interval);
    }, [token]);

    // Premium TV Styles (Safe Legacy Mode)
    const styles = {
        root: {
            backgroundColor: '#000',
            color: '#fff',
            width: '100%',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, Arial, sans-serif' // High readability
        },
        matrix: {
            display: 'table',
            width: '100%',
            height: '76%',
            borderCollapse: 'collapse' as const,
            tableLayout: 'fixed' as const,
        },
        matrixRow: {
            display: 'table-row',
        },
        matrixCell: {
            display: 'table-cell',
            width: '25%',
            padding: '1px',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative' as const,
            backgroundColor: '#000'
        },
        videoWrapper: {
            position: 'relative' as const,
            width: '100%',
            paddingTop: '56.25%', // 16:9
            backgroundColor: '#050505'
        },
        iframe: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
        },
        hud: {
            position: 'absolute' as const,
            top: '5px',
            left: '10px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '2px 8px',
            borderRadius: '2px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            pointerEvents: 'none' as const
        },
        rssContainer: {
            height: '24%',
            backgroundColor: '#000',
            padding: '0 2px'
        },
        rssRow: {
            height: '16%',
            backgroundColor: '#0a0a0a', // Solid Dark Theme
            marginBottom: '1px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.03)'
        },
        rssLabel: {
            backgroundColor: '#1a1a1a',
            color: '#e63946', // Vibrant Red Accent
            fontSize: '12px',
            fontWeight: '900',
            padding: '0 15px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            minWidth: '110px',
            borderRight: '1px solid #111',
            textTransform: 'uppercase' as const,
            fontStyle: 'italic'
        },
        rssMarquee: {
            whiteSpace: 'nowrap' as const,
            display: 'inline-block',
            fontSize: '22px', // Larger font for TV
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }
    };

    if (loading) return <div style={{...styles.root, display:'flex', alignItems:'center', justifyContent:'center'}}>SYNCING_STREAMS...</div>;

    return (
        <div style={styles.root}>
            {/* Matrix */}
            <div style={styles.matrix}>
                {[0, 1, 2].map(row => (
                    <div key={row} style={styles.matrixRow}>
                        {[0, 1, 2, 3].map(col => {
                            const index = (row * 4) + col;
                            const id = data?.youtube_ids?.[index];
                            return (
                                <div key={col} style={styles.matrixCell}>
                                    <div style={styles.videoWrapper}>
                                        {/* Camera HUD */}
                                        <div style={styles.hud}>
                                            <span style={{width:6, height:6, backgroundColor:'#e63946', borderRadius:'50%'}}></span>
                                            CH_{sprintf('%02d', index + 1)}
                                        </div>
                                        {id && index < loadCount ? (
                                            <iframe 
                                                src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`} 
                                                style={styles.iframe}
                                                allow="autoplay; encrypted-media"
                                            />
                                        ) : (
                                            <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:0.1}}>
                                                 <div style={{fontSize:'8px', marginBottom: '5px'}}>PREPARING...</div>
                                                 <div style={{fontSize:'12px', fontWeight:'bold'}}>0{{index + 1}}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* RSS Matrix (Slow Motion Mode) */}
            <div style={styles.rssContainer}>
                {[0, 1, 2, 3, 4, 5].map(f => {
                    const headlines = data?.rss_feeds?.[f] || [];
                    return (
                        <div key={f} style={styles.rssRow}>
                            <div style={styles.rssLabel}>STREAM 0{f+1}</div>
                            <div style={{flexGrow:1, overflow:'hidden', position:'relative'}}>
                                <div style={{
                                    ...styles.rssMarquee,
                                    animation: `marquee-tv-slow-${f} ${120 + (f * 15)}s linear infinite` // Dramatically Slower
                                }}>
                                    {headlines.length > 0 ? (
                                        [...headlines, ...headlines].map((h: any, hi: number) => (
                                            <span key={hi} style={{marginRight:'120px', display:'inline-flex', alignItems:'center', gap:'10px'}}>
                                                <span style={{width:'4px', height:'12px', backgroundColor:'#333'}}></span>
                                                {h.title}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{fontSize:'12px', opacity:0.3, padding:'0 20px'}}>Searching for active live headlines for stream 0{f+1}...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee-tv-slow-0 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-tv-slow-1 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-tv-slow-2 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-tv-slow-3 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-tv-slow-4 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-tv-slow-5 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            `}} />
        </div>
    );
}

function sprintf(format: string, ...args: any[]) {
    return format.replace(/%02d/g, () => {
        return args[0].toString().padStart(2, '0');
    });
}
