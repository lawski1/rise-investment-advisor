'use client';

import { useState, useEffect } from 'react';
import { Tv, ExternalLink, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

export default function BloombergTV() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [streamSource, setStreamSource] = useState<'youtube' | 'bloomberg'>('bloomberg');
  const [loadError, setLoadError] = useState(false);

  // Bloomberg TV stream sources
  // Note: Bloomberg.com may block iframe embedding, so we use YouTube as primary
  const streamSources = {
    youtube: 'https://www.youtube.com/embed/live_stream?channel=UCUMZ7gohGI9HcU9TZ33zdWQ&autoplay=1&mute=0', // Bloomberg TV YouTube channel
    bloomberg: 'https://www.bloomberg.com/live/stream',
  };

  useEffect(() => {
    setLoadError(false);
  }, [streamSource]);

  return (
    <div className={`bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong border border-slate-700/50 overflow-hidden transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-[100]' : 'relative'
    }`} style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 146, 60, 0.1)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <Tv className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-50">Bloomberg TV Live</h3>
            <p className="text-xs text-gray-400">Financial news and market coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Stream source selector */}
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1 border border-slate-600/50">
            <button
              onClick={() => setStreamSource('youtube')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                streamSource === 'youtube'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              YouTube
            </button>
            <button
              onClick={() => setStreamSource('bloomberg')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                streamSource === 'bloomberg'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              Bloomberg
            </button>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-gray-300" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className={`relative bg-black ${isExpanded ? 'h-[calc(100vh-120px)]' : 'h-[400px]'} transition-all duration-300`}>
        {loadError ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
            <h4 className="text-xl font-bold text-yellow-50 mb-2">Stream Unavailable</h4>
            <p className="text-gray-300 mb-4 max-w-md">
              The Bloomberg TV stream cannot be embedded directly. Click the button below to watch on Bloomberg's website.
            </p>
            <a
              href="https://www.bloomberg.com/live/stream"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              Watch on Bloomberg.com
            </a>
          </div>
        ) : (
          <>
            {streamSource === 'youtube' ? (
              <iframe
                src={streamSources.youtube}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Bloomberg TV YouTube Stream"
                style={{ border: 'none' }}
                onError={() => setLoadError(true)}
              />
            ) : (
              <iframe
                src={streamSources.bloomberg}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Bloomberg TV Live Stream"
                style={{ border: 'none' }}
                onError={() => setLoadError(true)}
              />
            )}
            
            {/* Overlay with link to Bloomberg */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://www.bloomberg.com/live/stream"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/90 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on Bloomberg
              </a>
            </div>
          </>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-yellow-50">Streaming Note:</strong> Bloomberg TV is available free on their website. 
            If the embedded stream doesn't load (due to embedding restrictions), click "Watch on Bloomberg" to view directly on Bloomberg.com. 
            The YouTube option uses Bloomberg's official YouTube channel when available.
          </p>
        </div>
      </div>
    </div>
  );
}

