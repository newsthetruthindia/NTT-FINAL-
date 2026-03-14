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
  const formattedDate = new Date(created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (variant === 'hero') {
    return (
      <div className="group relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl">
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
    <div className="group flex flex-col hover-lift bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={displayImage} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-heading font-black uppercase tracking-widest text-[#E63946] shadow-sm">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-heading font-extrabold leading-snug mb-3 group-hover:text-[#E63946] transition-colors line-clamp-2">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h3>
        {excerpt && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-heading font-bold uppercase tracking-widest text-gray-400">
          <span>{formattedDate}</span>
          <Link href={`/news/${slug}`} className="text-[#E63946] hover:underline">Read More</Link>
        </div>
      </div>
    </div>
  );
}
