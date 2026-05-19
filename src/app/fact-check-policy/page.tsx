import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FactCheckPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Fact Check <span className="text-red-600">Policy</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Rigorous Verification</h2>
            <p>
              At News The Truth, accuracy is paramount. We employ a rigorous fact-checking process to ensure that all claims made in our reporting are backed by evidence and verified by multiple sources.
            </p>
            <p>
              Our editorial team systematically reviews primary documents, official records, and corroborating witness testimonies before any story is published. If a claim cannot be independently verified, it will not be reported as fact.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
