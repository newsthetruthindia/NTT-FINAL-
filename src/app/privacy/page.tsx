import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Privacy <span className="text-red-600">Policy</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Commitment to Anonymity</h2>
            <p>
              At News The Truth (NTT), we prioritize the safety and anonymity of our sources above all else. This policy outlines how we handle data while maintaining our commitment to free and fearless journalism.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Information We Collect</h2>
            <p>
              We only collect information that is strictly necessary for providing our news services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information</strong>: If you choose to register, we store your email and name securely.</li>
              <li><strong>Citizen Reports</strong>: Information submitted through our secure portal is handled with extreme confidentiality.</li>
              <li><strong>Analytics</strong>: We use anonymized data to understand which stories matter most to our audience.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Data Protection</h2>
            <p>
              Your data is encrypted both in transit and at rest. We do not sell your personal information to third parties or advertisers. Our servers are configured to minimize logging and maximize source protection.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 italic text-sm text-gray-500">
            Last updated: March 2026. For privacy concerns, please contact us at privacy@newsthetruth.com.
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
