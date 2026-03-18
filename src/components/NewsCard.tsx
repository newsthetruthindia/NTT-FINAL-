import Link from 'next/link';
import { Post, getImageUrl } from '@/lib/api';

interface NewsCardProps {
  post: Post;
  variant?: 'hero' | 'standard';
}

export default function NewsCard({ post, variant = 'standard' }: NewsCardProps) {
  const { title, slug, categories, created_at, thumbnails, excerpt } = post;
  
  const categoryName = categories?.[0]?.cat_data?.title || 'News';
    
  const displayImage = getImageUrl(thumbnails?.url);
  
  // Use a fixed format or suppress hydration warning to avoid mismatches
  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent';

  if (variant === 'hero') {
    return (
      <div className="group relative h-full min-h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl">
        <img 
          src={displayImage} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 lg:p-12 flex flex-col justify-end">
          <div className="mb-6">
            <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-heading font-black uppercase tracking-[0.2em] text-white">
              {categoryName}
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-heading font-black text-white mb-4 leading-[1.1] tracking-tight group-hover:underline underline-offset-8 decoration-primary decoration-4">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h2>
          <div className="flex items-center gap-4 text-white/60 text-xs font-heading font-bold uppercase tracking-widest">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>By NTT Desk</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col hover-lift bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={displayImage} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-5 left-5">
          <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-gray-100">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-gray-950 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 decoration-primary/30 decoration-2 group-hover:underline underline-offset-4">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h3>
        {excerpt && (
          <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-[11px] font-extrabold text-gray-600 uppercase tracking-widest flex items-center gap-2 italic">
            <span className="w-1 h-1 rounded-full bg-primary" />
            {formattedDate}
          </span>
          <Link 
            href={`/news/${post.slug}`}
            className="text-[11px] font-black text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
          >
            Read Story
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
