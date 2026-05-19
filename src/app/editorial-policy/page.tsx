import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Editorial <span className="text-red-600">Policy</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Our Commitment to the Truth</h2>
            <p>
              News The Truth is committed to delivering accurate, unbiased, and fearless journalism. Our editorial policy is built on the foundation of transparency, integrity, and independence.
            </p>
            <p>
              We believe that our primary responsibility is to our readers. Our journalists are required to report the news without fear or favor, ensuring that all perspectives are fairly represented and that the truth is never compromised.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
