export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className="p-20 text-center">
      <h1 className="text-4xl font-black">Minimal Render - No Components</h1>
      <p className="mt-4 text-gray-400">If you see this, the Page itself is working.</p>
    </div>
  );
}
