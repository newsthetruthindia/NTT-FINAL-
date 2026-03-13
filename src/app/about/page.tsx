import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-gray-900 mb-8 border-l-8 border-red-600 pl-6 uppercase">About <span className="text-red-600">NTT</span></h1>
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
          <p>News The Truth (NTT) is dedicated to investigative journalism and delivering unbiased news to the heart of our community. We believe in the power of truth and the importance of holding those in power accountable.</p>
          <p>Our team of journalists works tirelessly to bring you the stories that matter most, with a commitment to integrity, accuracy, and depth.</p>
        </div>
      </article>
      <Footer />
    </main>
  );
}
