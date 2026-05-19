import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CorrectionsPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Corrections <span className="text-red-600">Policy</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Transparency in Mistakes</h2>
            <p>
              While we strive for perfection, journalism is a human endeavor, and mistakes can happen. When we make an error, our policy is to correct it promptly, prominently, and transparently.
            </p>
            <p>
              Any substantive correction to a story will be clearly noted at the top or bottom of the article, explaining what was wrong and what the correct information is. We do not stealth-edit factual errors.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
