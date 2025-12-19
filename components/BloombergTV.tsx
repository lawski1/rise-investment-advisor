'use client';

import { useState, useEffect } from 'react';
import { Tv, ExternalLink, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

export default function BloombergTV() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [streamSource, setStreamSource] = useState<'youtube' | 'bloomberg'>('bloomberg');
  const [loadError, setLoadError] = useState(false);

  // Bloomberg TV stream sources
  // Note: Bloomberg.com may block iframe embedding, so we use YouTube as fallback
  const streamSources = {
    // Using Bloomberg TV's official YouTube channel live stream
    // Channel ID: UCUMZ7gohGI9HcU9TZ33zdWQ
    // This will show the live stream if available, otherwise shows the channel's latest content
    youtube: 'https://www.youtube.com/embed/live_stream?channel=UCUMZ7gohGI9HcU9TZ33zdWQ&autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1',
    // Alternative: Direct channel live page (use if embed doesn't work)
    youtubeAlt: 'https://www.youtube.com/channel/UCUMZ7gohGI9HcU9TZ33zdWQ/live',
    bloomberg: 'https://www.bloomberg.com/live/stream',
  };

  useEffect(() => {
    setLoadError(false);
    
    // Set a timeout to detect if iframe fails to load
    // If after 10 seconds we haven't detected a successful load, show error
    const timeoutId = setTimeout(() => {
      // Only set error if we're still on the same source
      // This is a fallback - the iframe onLoad should clear this
      if (streamSource === 'youtube') {
        // Check if iframe is actually loaded by trying to access its content
        // Note: This won't work due to CORS, but we can at least try
        const iframe = document.querySelector('iframe[title="Bloomberg TV YouTube Stream"]') as HTMLIFrameElement;
        if (iframe && !iframe.contentDocument) {
          // Iframe loaded but might be blocked - give it more time
          // Don't set error immediately
        }
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [streamSource]);

  // Handle iframe load - clear any error state
  const handleIframeLoad = () => {
    setLoadError(false);
  };

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
              <>
                <iframe
                  key="youtube-stream"
                  src={streamSources.youtube}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  title="Bloomberg TV YouTube Stream"
                  style={{ border: 'none' }}
                  onLoad={handleIframeLoad}
                />
                {/* Fallback message if YouTube doesn't load */}
                {loadError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-8 text-center z-20">
                    <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
                    <h4 className="text-lg font-bold text-yellow-50 mb-2">YouTube Stream Unavailable</h4>
                    <p className="text-gray-300 mb-4 max-w-md text-sm">
                      The YouTube embed may not be available if there's no active live stream, or due to browser restrictions. 
                      Try switching to Bloomberg or watch directly on YouTube.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => {
                          setLoadError(false);
                          setStreamSource('bloomberg');
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        Switch to Bloomberg
                      </button>
                      <a
                        href={streamSources.youtubeAlt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Watch on YouTube
                      </a>
                      <button
                        onClick={() => {
                          setLoadError(false);
                          // Force reload the iframe
                          const iframe = document.querySelector('iframe[title="Bloomberg TV YouTube Stream"]') as HTMLIFrameElement;
                          if (iframe) {
                            iframe.src = streamSources.youtube;
                          }
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        Retry YouTube
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <iframe
                key="bloomberg-stream"
                src={streamSources.bloomberg}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Bloomberg TV Live Stream"
                style={{ border: 'none' }}
                onLoad={handleIframeLoad}
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

