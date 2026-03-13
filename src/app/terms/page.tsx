import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl font-black text-gray-900 border-l-8 border-red-600 pl-6 uppercase mb-12">Terms of <span className="text-red-600">Service</span></h1>
        <p>By using NTT, you agree to comply with our standards of conduct and respect for community guidelines.</p>
        <h2>Content Usage</h2>
        <p>All content on NTT is protected by copyright and may not be reproduced without explicit permission.</p>
      </article>
      <Footer />
    </main>
  );
}
