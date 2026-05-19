import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PhysicalOfficePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-600 prose prose-lg">
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 border-l-[10px] border-red-600 pl-8 uppercase mb-16 tracking-tighter">
          Physical <span className="text-red-600">Office</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-10 font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Our Headquarters</h2>
            <p>
              While News The Truth operates a decentralized network of journalists across the country, our central operations are based in our physical headquarters.
            </p>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mt-8 mb-8">
              <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide">Mailing & Office Address</h3>
              <p className="text-gray-700 font-medium">
                20B ABDUL HAMID STREET<br />
                KOLKATA 700069
              </p>
            </div>
            <p>
              Please reach out to us via our secure Contact or Press Portal for any inquiries. For security reasons, walk-in visits are strictly by appointment only.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
