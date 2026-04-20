import Link from 'next/link';
import Image from 'next/image';
import { Post, getImageUrl } from '@/lib/api';

interface NewsCardProps {
  post: Post;
  variant?: 'hero' | 'standard' | 'landscape' | 'compact';
}

export default function NewsCard({ post, variant = 'standard' }: NewsCardProps) {
  const { title, slug, categories, created_at, thumbnails, excerpt, reporter_name, user } = post;
  
  const categoryName = categories?.[0]?.cat_data?.title || 'News';
    
  const displayImage = getImageUrl(thumbnails?.url);
  
  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent';

  // Fallback for excerpt to maintain card height consistency
  const displayExcerpt = excerpt || (post.description ? post.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : '');

  // Attribution Link Logic
  const renderAttribution = () => {
    const name = reporter_name || (user ? `${user.firstname} ${user.lastname || ''}`.trim() : 'NTT DESK');
    
    // As per user request: "only need reporter name in frontend"
    // No links to backend user profiles allowed.
    return <span className="uppercase">BY {name}</span>;
  };

  // Responsive sizes string for next/image
  const sizes = variant === 'hero' 
    ? '(max-width: 768px) 100vw, 80vw'
    : variant === 'landscape'
    ? '(max-width: 768px) 100vw, 50vw'
    : variant === 'compact'
    ? '80px'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';

  if (variant === 'compact') {
    return (
      <div className="group flex items-center gap-4 p-3 bg-card/40 hover:bg-card/70 backdrop-blur-sm rounded-2xl transition-all duration-500 border border-white/5 hover:border-primary/20 hover:shadow-2xl">
        <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-xl shadow-inner border border-white/5">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] font-heading">
              {categoryName}
            </span>
          </div>
          <h5 className="text-sm font-black text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors editorial-heading tracking-tight">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h5>
        </div>
      </div>
    );
  }

  if (variant === 'landscape') {
    return (
      <div className="group flex flex-col sm:flex-row h-full w-full overflow-hidden rounded-[24px] md:rounded-[32px] bg-card/60 backdrop-blur-sm border border-white/5 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
        <div className="sm:w-[45%] relative overflow-hidden h-[200px] sm:h-auto min-h-[200px]">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute top-5 left-5 z-10">
            <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl border border-white/10">
              {categoryName}
            </span>
          </div>
        </div>
        <div className="sm:w-[55%] p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-lg lg:text-2xl font-bold text-foreground mb-3 leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-3 editorial-heading uppercase">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h2>
          {displayExcerpt && (
            <p className="text-foreground/50 text-xs lg:text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
              {displayExcerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-3 text-foreground/40 text-[10px] font-black uppercase tracking-widest italic">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {formattedDate}
              </span>
              <span className="text-primary font-black ml-2">{renderAttribution()}</span>
            </div>
            <Link href={`/news/${slug}`} className="p-2 rounded-full bg-white/5 group-hover:bg-primary transition-all duration-300">
              <svg className="w-4 h-4 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="group relative h-full min-h-[550px] lg:min-h-[650px] w-full overflow-hidden rounded-[40px] shadow-2xl transition-all duration-700">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 85vw"
            className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 lg:p-12 flex flex-col justify-end">
          <div className="mb-4 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="premium-gradient px-4 py-1 rounded-full text-[9px] font-heading font-black uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              {categoryName}
            </span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight group-hover:text-primary transition-all duration-500 editorial-heading z-10 uppercase translate-y-4 group-hover:translate-y-0 shadow-text max-w-2xl">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h2>
          <div className="flex items-center gap-6 text-white/50 text-[10px] font-heading font-black uppercase tracking-[0.2em] z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {formattedDate}
            </span>
            <span className="w-px h-3 bg-white/20"></span>
            <div className="text-white hover:text-primary transition-colors cursor-pointer">
              {renderAttribution()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-card/40 backdrop-blur-sm rounded-[32px] overflow-hidden border border-white/5 h-full transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_32px_64px_rgba(0,0,0,0.4)] hover:border-primary/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-2xl border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-6 md:p-8 pb-8 flex flex-col flex-grow">
        <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-4 group-hover:text-primary transition-all duration-500 line-clamp-2 editorial-heading tracking-tight uppercase">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h3>
        {displayExcerpt && (
          <p className="text-foreground/60 text-xs md:text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
            {displayExcerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-4 text-foreground/40 text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
              <span className="italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {formattedDate}
              </span>
              <span className="text-primary/70">{renderAttribution()}</span>
            </div>
          </div>
          <Link 
            href={`/news/${post.slug}`}
            className="group/btn flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300"
          >
            <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
