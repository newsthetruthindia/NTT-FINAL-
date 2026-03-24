import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-12 border-l-[12px] border-primary pl-8 uppercase tracking-tighter">
          The Voice of <span className="text-primary">The People</span>
        </h1>
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed font-medium space-y-8">
          <p className="text-2xl text-foreground font-bold leading-tight">
            News The Truth (NTT) is more than just a news portal. It is a movement dedicated to the pursuit of authentic storytelling and the protection of democratic values.
          </p>
          <p>
            In an era of misinformation and polarized narratives, NTT stands as a beacon of integrity. Our mission is simple but profound: to provide a platform where the truth is not just reported, but protected. We focus on investigative journalism, local stories that often go unheard, and holding those in power accountable to the citizens they serve.
          </p>
          <div className="bg-accent p-10 rounded-[40px] border border-border my-12">
            <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">Our Core Values</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Unbiased Reporting</strong>: We let the facts speak for themselves, without external influence or corporate bias.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Source Protection</strong>: We go to extreme lengths to protect the anonymity and safety of our whistleblowers.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Hyper-Local Focus</strong>: We believe that what happens in your community matters as much as global headlines.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Citizen Empowerment</strong>: Through our reporting platform, every citizen can become a contributor to the truth.</span>
              </li>
            </ul>
          </div>
          <p>
            Founded in the heart of West Bengal, NTT has grown into a trusted source for regional and national news. Our team of dedicated journalists and field reporters work tirelessly to verify every claim before it reaches your screen.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  );
}
