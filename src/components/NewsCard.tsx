import Link from 'next/link';
import Image from 'next/image';
import { Post, getImageUrl } from '@/lib/api';

interface NewsCardProps {
  post: Post;
  variant?: 'hero' | 'standard' | 'landscape' | 'compact';
}

export default function NewsCard({ post, variant = 'standard' }: NewsCardProps) {
  const { title, slug, categories, created_at, thumbnails, excerpt } = post;
  
  const categoryName = categories?.[0]?.cat_data?.title || 'News';
    
  const displayImage = getImageUrl(thumbnails?.url);
  
  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent';

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
      <div className="group flex items-center gap-4 p-3 bg-card/50 hover:bg-card rounded-2xl transition-all duration-300 border border-transparent hover:border-border hover:shadow-lg">
        <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-xl shadow-sm">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-grow min-w-0">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 block">
            {categoryName}
          </span>
          <h5 className="text-sm font-black text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors editorial-heading">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h5>
        </div>
      </div>
    );
  }

  if (variant === 'landscape') {
    return (
      <div className="group flex flex-col sm:flex-row h-full w-full overflow-hidden rounded-[24px] md:rounded-[32px] bg-card border border-border hover-lift">
        <div className="sm:w-[40%] relative overflow-hidden h-[180px] sm:h-auto min-h-[180px]">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 30vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
              {categoryName}
            </span>
          </div>
        </div>
        <div className="sm:w-[60%] p-5 md:p-6 flex flex-col justify-center">
          <h2 className="text-lg lg:text-xl font-black text-foreground mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2 editorial-heading">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h2>
          {excerpt && (
            <p className="text-foreground/60 text-[11px] lg:text-xs mb-4 line-clamp-2 leading-relaxed font-medium">
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-foreground/50 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-primary/10 border border-border flex-shrink-0 relative">
                {post.user?.thumbnails?.url ? (
                  <Image 
                    src={getImageUrl(post.user.thumbnails.url)} 
                    alt={post.user.firstname} 
                    fill
                    sizes="20px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[7px] text-primary font-black">NTT</div>
                )}
              </div>
              <span className="flex items-center gap-1.5 italic">
                  {formattedDate}
              </span>
            </div>
              <span className="text-foreground/60 font-black hover:text-primary transition-colors uppercase">
                <Link href={`/reporter/${post.user?.id || 1}`}>
                  BY {post.reporter_name || (post.user ? `${post.user.firstname} ${post.user.lastname || ''}`.trim() : 'NTT DESK')}
                </Link>
              </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="group relative h-full min-h-[500px] w-full overflow-hidden rounded-3xl hover-lift">
          <Image 
            src={displayImage} 
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 lg:p-12 flex flex-col justify-end">
          <div className="mb-6 z-10">
            <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-heading font-black uppercase tracking-[0.2em] text-white">
              {categoryName}
            </span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-black text-white mb-4 leading-[1.1] tracking-tight group-hover:text-primary transition-colors editorial-heading z-10">
            <Link href={`/news/${slug}`}>{title}</Link>
          </h2>
          <div className="flex items-center gap-4 text-white/70 text-xs font-heading font-bold uppercase tracking-widest z-10">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <Link href={`/reporter/${post.user?.id || 1}`} className="hover:text-primary transition-colors">
              <span>By {post.user ? `${post.user.firstname} ${post.user.lastname || ''}`.trim() : 'NTT Desk'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col hover-lift bg-card rounded-[32px] overflow-hidden border border-border h-full transition-all duration-500">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image 
            src={displayImage} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-card/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-border">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 editorial-heading">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h3>
        {excerpt && (
          <p className="text-foreground/60 text-sm mb-6 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <span className="text-[11px] font-extrabold text-foreground/50 uppercase tracking-widest flex items-center gap-2 italic">
            <span className="w-1 h-1 rounded-full bg-primary" />
            {formattedDate}
          </span>
          <Link 
            href={`/news/${post.slug}`}
            className="text-[11px] font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
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
