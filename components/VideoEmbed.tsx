'use client';

import { Play, ExternalLink, Search, Youtube } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  searchQuery: string;
}

export default function VideoEmbed({ videoId, title, searchQuery }: VideoEmbedProps) {
  // Use YouTube thumbnail API - this always works
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-lg overflow-hidden group cursor-pointer">
      {/* YouTube Thumbnail */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 block"
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to lower quality thumbnail if maxresdefault fails
            const target = e.target as HTMLImageElement;
            if (target.src !== fallbackThumbnailUrl) {
              target.src = fallbackThumbnailUrl;
            }
          }}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-20 h-20 bg-orange-500/90 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 transition-transform shadow-2xl">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
          <h4 className="text-lg font-semibold text-yellow-50 line-clamp-2">{title}</h4>
        </div>
      </a>
      
      {/* Action buttons overlay */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1.5 bg-black/80 text-white rounded text-xs font-medium hover:bg-black transition-colors flex items-center gap-1.5"
          title="Watch on YouTube"
        >
          <Youtube className="w-3.5 h-3.5" />
          YouTube
        </a>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1.5 bg-black/80 text-white rounded text-xs font-medium hover:bg-black transition-colors flex items-center gap-1.5"
          title="Search for tutorials"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </a>
      </div>
    </div>
  );
}

