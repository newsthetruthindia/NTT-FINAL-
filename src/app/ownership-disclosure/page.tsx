import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OwnershipDisclosurePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Ownership <span className="text-red-600">Disclosure</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Who We Are</h2>
            <p>
              News The Truth is a brand owned and operated by Alethia Media and Communication Private Limited. We operate with complete editorial independence. We are transparent about our ownership structure to ensure our readers know exactly who is funding our journalism.
            </p>
            <p>
              We are an independent media organization. Our funding comes primarily from grassroots supporters, independent sponsors, and non-partisan grants. No corporate entity or political organization dictates our editorial direction.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
