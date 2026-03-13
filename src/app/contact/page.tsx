import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-gray-900 mb-8 border-l-8 border-red-600 pl-6 uppercase">Contact <span className="text-red-600">Us</span></h1>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-12">
          <p className="text-gray-600 mb-6 font-medium">Have a tip or a story? We'd love to hear from you.</p>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-1">Email</h3>
              <p className="text-xl font-bold text-gray-900">contact@newsthetruth.com</p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-1">Office</h3>
              <p className="text-xl font-bold text-gray-900">Kolkata, West Bengal, India</p>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
