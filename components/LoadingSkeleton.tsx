'use client';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-20 animate-pulse" />
      
      {/* Nav Skeleton */}
      <div className="bg-white h-16 border-b border-gray-200 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Market Summary Skeleton */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-300 rounded w-24 mb-4" />
                <div className="h-10 bg-gray-300 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Investment Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="h-6 bg-gray-300 rounded w-20 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-40" />
                </div>
                <div className="h-6 bg-gray-300 rounded w-16" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


