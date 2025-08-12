"use client"

interface FloatingToolbarProps {
  onCreateSprite: () => void;
  onCreateCircle: () => void;
  onCreateRect: () => void;
}

export default function FloatingToolbar({
  onCreateSprite,
  onCreateCircle,
  onCreateRect
}: FloatingToolbarProps) {
  return (
    <div className="fixed top-6 left-6 z-40">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-3">
        <div className="flex space-x-1">
          <button
            onClick={onCreateSprite}
            className="group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            title="Create Sprite"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Sprite
            </div>
          </button>

          <button
            onClick={onCreateCircle}
            className="group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            title="Create Circle"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
            </svg>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Circle
            </div>
          </button>

          <button
            onClick={onCreateRect}
            className="group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            title="Create Rectangle"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
            </svg>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Rectangle
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
