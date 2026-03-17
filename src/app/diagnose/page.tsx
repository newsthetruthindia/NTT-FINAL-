import { getImageUrl } from '@/lib/api';

export default function DiagnosePage() {
  const testUrl = 'http://117.252.16.132/public/uploads/test.jpg'; // Assuming the user intended to keep the full URL or change it to a valid one, not the malformed 'publ'
  const proxied = getImageUrl(testUrl);
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>NTT Diagnostic Page</h1>
      <p>Version: 1.1.7 (Proxy Logging Enabled)</p>
      <hr />
      <h3>Environment Variables:</h3>
      <pre>
        NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'MISSING'}<br />
        NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL || 'MISSING'}
      </pre>
      <hr />
      <h3>URL Transformation Test:</h3>
      <p>Original: {testUrl}</p>
      <p>Proxied: {proxied}</p>
      <hr />
      <h3>Current Routing Check:</h3>
      <p>If you see this, the dynamic route collision on / is likely resolved.</p>
    </div>
  );
}
