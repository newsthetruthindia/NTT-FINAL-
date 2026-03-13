import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl font-black text-gray-900 border-l-8 border-red-600 pl-6 uppercase mb-12">Privacy <span className="text-red-600">Policy</span></h1>
        <p>Your privacy is important to us. This policy explains how we collect and use your data.</p>
        <h2>Data Collection</h2>
        <p>We only collect data necessary for providing our news services and improving your user experience.</p>
      </article>
      <Footer />
    </main>
  );
}
