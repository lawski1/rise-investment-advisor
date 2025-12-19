'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, Search } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  searchQuery: string;
}

export default function VideoEmbed({ videoId, title, searchQuery }: VideoEmbedProps) {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset error state when videoId changes
    setVideoError(false);
    setIsLoading(true);

    // Set a timeout to detect if video fails to load
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setVideoError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [videoId, isLoading]);

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setVideoError(false);
  };

  // Check if iframe loaded successfully
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const checkVideo = () => {
      try {
        // Try to access iframe content (will fail if video unavailable)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        // If we can't access, it might be due to CORS, but that's normal for YouTube
        // We'll rely on the timeout instead
      } catch (e) {
        // CORS error is expected, not necessarily a video error
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  if (videoError) {
    return (
      <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center border border-slate-600/50 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-yellow-50 mb-2">{title}</h4>
          <p className="text-gray-300 mb-4 text-sm">Video may be unavailable or restricted. Click below to search for tutorials on YouTube.</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <Search className="w-5 h-5" />
              Search YouTube for Tutorials
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-600/50 text-gray-300 rounded-lg font-medium hover:bg-slate-600/70 transition-colors text-sm"
            >
              Try Direct Link
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
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
      />
      {/* Overlay with search option */}
      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity z-20">
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

