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
        const interval = setInterval(fetchData, 60000); 
        return () => clearInterval(interval);
    }, [token]);

    // Inline Style Constants for Maximum TV Compatibility
    const styles = {
        root: {
            backgroundColor: '#000',
            color: '#fff',
            width: '100%',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            fontFamily: 'monospace, sans-serif'
        },
        matrix: {
            display: 'table',
            width: '100%',
            height: '80%',
            borderCollapse: 'collapse' as const,
            tableLayout: 'fixed' as const
        },
        matrixRow: {
            display: 'table-row',
            height: '33.33%'
        },
        matrixCell: {
            display: 'table-cell',
            width: '25%',
            padding: '2px',
            border: '1px solid #111',
            verticalAlign: 'middle',
            textAlign: 'center' as const,
            position: 'relative' as const
        },
        videoWrapper: {
            position: 'relative' as const,
            width: '100%',
            paddingTop: '56.25%', // 16:9
            backgroundColor: '#111'
        },
        iframe: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000'
        },
        rssContainer: {
            height: '20%',
            backgroundColor: '#000',
            padding: '2px'
        },
        rssRow: {
            height: '15%',
            backgroundColor: '#dadada',
            marginBottom: '1px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            color: '#000'
        },
        rssLabel: {
            backgroundColor: '#222',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '900',
            padding: '0 10px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            minWidth: '90px',
            borderRight: '2px solid #000'
        },
        rssMarquee: {
            whiteSpace: 'nowrap' as const,
            display: 'inline-block',
            fontSize: '16px',
            fontWeight: 'bold'
        }
    };

    if (loading) return <div style={{...styles.root, display:'flex', alignItems:'center', justifyContent:'center'}}>WAITING FOR DATA...</div>;
    if (error) return <div style={{...styles.root, display:'flex', alignItems:'center', justifyContent:'center', color:'red'}}>ERROR: PLEASE REFRESH</div>;

    return (
        <div style={styles.root}>
            {/* 4x3 Table-Based Matrix (High Compatibility) */}
            <div style={styles.matrix}>
                {[0, 1, 2].map(row => (
                    <div key={row} style={styles.matrixRow}>
                        {[0, 1, 2, 3].map(col => {
                            const index = (row * 4) + col;
                            const id = data?.youtube_ids?.[index];
                            return (
                                <div key={col} style={styles.matrixCell}>
                                    <div style={styles.videoWrapper}>
                                        {id ? (
                                            <iframe 
                                                src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&modestbranding=1`} 
                                                style={styles.iframe}
                                                allow="autoplay; encrypted-media"
                                            />
                                        ) : (
                                            <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.3, fontSize:'10px'}}>
                                                NO SIGNAL
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* RSS Matrix (Legacy Flex/Marquee) */}
            <div style={styles.rssContainer}>
                {[0, 1, 2, 3, 4, 5].map(f => {
                    const headlines = data?.rss_feeds?.[f] || [];
                    return (
                        <div key={f} style={styles.rssRow}>
                            <div style={styles.rssLabel}>FEED 0{f+1}</div>
                            <div style={{flexGrow:1, overflow:'hidden', position:'relative'}}>
                                <div id={`marquee-${f}`} style={{
                                    ...styles.rssMarquee,
                                    animation: `marquee-scroll-${f} ${50 + (f * 10)}s linear infinite`
                                }}>
                                    {headlines.length > 0 ? (
                                        [...headlines, ...headlines].map((h, hi) => (
                                            <span key={hi} style={{marginRight:'80px'}}>
                                                ● {h.title}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{fontSize:'12px', opacity:0.5, padding:'0 20px'}}>Synchronizing feed 0{f+1}...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legacy Keyframe Injector */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee-scroll-0 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-scroll-1 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-scroll-2 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-scroll-3 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-scroll-4 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-scroll-5 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            `}} />
        </div>
    );
}
