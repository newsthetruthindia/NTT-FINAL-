'use client';

import { getImageUrl } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
    cat_data?: {
        url: string;
        alt?: string;
    }
}

interface ArticleGalleryProps {
    images: GalleryImage[];
}

export default function ArticleGallery({ images }: ArticleGalleryProps) {
    const [activeImage, setActiveImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <section className="my-16 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-grow bg-border/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">Image Gallery</span>
                <div className="h-px flex-grow bg-border/50" />
            </div>

            <div className={`grid gap-4 ${
                images.length === 1 ? 'grid-cols-1' : 
                images.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2 lg:grid-cols-3'
            }`}>
                {images.map((img, idx) => {
                    const url = getImageUrl(img.cat_data?.url);
                    return (
                        <div 
                            key={idx} 
                            className={`relative overflow-hidden rounded-3xl border border-white/5 cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 ${
                                images.length > 2 && idx === 0 ? 'lg:col-span-2 lg:row-span-2 aspect-video' : 'aspect-square'
                            }`}
                            onClick={() => setActiveImage(url)}
                        >
                            <Image
                                src={url}
                                alt={img.cat_data?.alt || 'Gallery image'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simple Lightbox */}
            {activeImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 animate-in fade-in zoom-in duration-300"
                    onClick={() => setActiveImage(null)}
                >
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
                        <Image
                            src={activeImage}
                            alt="Lightbox view"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
