'use client';

import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  searchQuery: string;
}

export default function VideoEmbed({ videoId, title, searchQuery }: VideoEmbedProps) {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset error state when videoId changes
    setVideoError(false);
    setIsLoading(true);
  }, [videoId]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setVideoError(true);
    setIsLoading(false);
  };

  if (videoError) {
    return (
      <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-300 mb-4">Video unavailable</p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            Search for Tutorial
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-slate-700/50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
}

