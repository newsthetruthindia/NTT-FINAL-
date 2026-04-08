import { fetchLatestPosts, fetchTopPosts, fetchCategories, fetchCategoryPosts, fetchTags, fetchVideos } from '@/lib/api'

const INTERNAL_API_URL = 'http://117.252.16.132/api/';

export default async function DiagnosePage() {
  const diagnosticResults: any[] = [];
  
  const testFetch = async (name: string, fetchFn: () => Promise<any>) => {
    try {
      const start = Date.now();
      const data = await fetchFn();
      const end = Date.now();
      diagnosticResults.push({
        name,
        status: 'OK',
        count: Array.isArray(data) ? data.length : (data ? 1 : 0),
        time: `${end - start}ms`,
        sample: Array.isArray(data) && data.length > 0 ? JSON.stringify(data[0]).substring(0, 100) : 'N/A'
      });
    } catch (err: any) {
      diagnosticResults.push({
        name,
        status: 'ERROR',
        message: err.message
      });
    }
  };

  const testClientFetch = async (name: string, url: string) => {
    try {
      const start = Date.now();
      const res = await fetch(url, { cache: 'no-store' });
      const end = Date.now();
      const data = await res.json();
      diagnosticResults.push({
        name,
        status: res.ok ? 'OK' : 'WARN',
        count: data?.data?.id ? 1 : (data?.id ? 1 : 0),
        time: `${end - start}ms`,
        sample: JSON.stringify(data).substring(0, 100)
      });
    } catch (err: any) {
      diagnosticResults.push({ name, status: 'ERROR', message: err.message });
    }
  };

  await Promise.all([
    testFetch('Top Posts', () => fetchTopPosts(5)),
    testFetch('Latest Posts', () => fetchLatestPosts(5)),
    testFetch('Categories', () => fetchCategories()),
    testFetch('Tags', () => fetchTags()),
    testFetch('Videos', () => fetchVideos()),
    testFetch('India Category', () => fetchCategoryPosts('india', 1)),
    testFetch('Bengal Category', () => fetchCategoryPosts('bengal', 1)),
    testFetch('Politics Category', () => fetchCategoryPosts('politics', 1)),
    testClientFetch('Ad: Banner', `${INTERNAL_API_URL}sponsor/banner`),
    testClientFetch('Ad: Sidebar', `${INTERNAL_API_URL}sponsor/sidebar`),
    testClientFetch('Ad: Splash', `${INTERNAL_API_URL}sponsor/splash`),
  ]);

  return (
    <div className="p-12 font-mono flex flex-col gap-8 bg-black text-green-400 min-h-screen">
      <h1 className="text-4xl font-black border-b border-green-800 pb-4">NTT API DIAGNOSTIC</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {diagnosticResults.map((res, i) => (
          <div key={i} className={`p-6 rounded-lg border ${res.status === 'OK' ? 'border-green-800 bg-green-950/20' : 'border-red-800 bg-red-950/20'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold">{res.name}</span>
              <span className={`px-3 py-1 rounded text-xs font-black ${res.status === 'OK' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                {res.status}
              </span>
            </div>
            {res.status === 'OK' ? (
              <div className="text-sm opacity-80">
                <p>Count: {res.count}</p>
                <p>Time: {res.time}</p>
                <p className="mt-2 text-xs text-green-600 truncate">Sample: {res.sample}</p>
              </div>
            ) : (
              <p className="text-red-400 font-bold">{res.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-900 rounded border border-gray-800">
        <h3 className="text-white font-bold mb-2">Environment Info:</h3>
        <p>INTERNAL_API_URL used: http://117.252.16.132/api/</p>
        <p>Node Version: {process.version}</p>
      </div>
    </div>
  );
}
