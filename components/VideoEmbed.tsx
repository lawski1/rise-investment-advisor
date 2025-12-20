'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, Search, Youtube } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  searchQuery: string;
}

export default function VideoEmbed({ videoId, title, searchQuery }: VideoEmbedProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadAttemptedRef = useRef(false);

  useEffect(() => {
    // Reset when videoId changes
    setShowEmbed(false);
    setVideoError(false);
    setIsLoading(false);
    loadAttemptedRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [videoId]);

  const handleLoadEmbed = () => {
    setShowEmbed(true);
    setIsLoading(true);
    loadAttemptedRef.current = true;

    // Set timeout to detect if video doesn't load
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setVideoError(true);
        setIsLoading(false);
      }
    }, 8000);
  };

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setVideoError(false);
  };

  // Default to showing placeholder - user clicks to load video
  if (!showEmbed) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/50 rounded-lg overflow-hidden group">
        {/* Thumbnail placeholder */}
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <div className="text-center p-6 z-10">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-orange-400" />
            </div>
            <h4 className="text-lg font-semibold text-yellow-50 mb-2">{title}</h4>
            <p className="text-gray-300 text-sm mb-4">Click to load video tutorial</p>
            <button
              onClick={handleLoadEmbed}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-3"
            >
              <Play className="w-5 h-5" />
              Load Video
            </button>
            <div className="flex gap-2 justify-center">
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600/50 text-gray-300 rounded-lg font-medium hover:bg-slate-600/70 transition-colors text-sm"
              >
                <Youtube className="w-4 h-4" />
                Watch on YouTube
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600/50 text-gray-300 rounded-lg font-medium hover:bg-slate-600/70 transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                Search
              </a>
            </div>
          </div>
        </div>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 146, 60, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center border border-slate-600/50 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-yellow-50 mb-2">{title}</h4>
          <p className="text-gray-300 mb-4 text-sm">Video may be unavailable or restricted. Click below to watch on YouTube.</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              Watch on YouTube
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-600/50 text-gray-300 rounded-lg font-medium hover:bg-slate-600/70 transition-colors text-sm"
            >
              <Search className="w-4 h-4" />
              Search for Tutorials
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-slate-700/50 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleIframeLoad}
      />
      {/* Overlay with options */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity z-20">
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-black/70 text-white rounded text-xs font-medium hover:bg-black/90 transition-colors flex items-center gap-1"
          title="Open on YouTube"
        >
          <Youtube className="w-3 h-3" />
          YouTube
        </a>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-black/70 text-white rounded text-xs font-medium hover:bg-black/90 transition-colors flex items-center gap-1"
          title="Search for alternative videos"
        >
          <Search className="w-3 h-3" />
          Search
        </a>
      </div>
    </div>
  );
}

