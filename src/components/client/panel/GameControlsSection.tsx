"use client"

interface GameControlsSectionProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export default function GameControlsSection({
  isPlaying,
  onPlay,
  onStop
}: GameControlsSectionProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className={`
          w-full py-3 px-4 rounded-lg font-medium
          transition-all duration-200 ease-in-out
          flex items-center justify-center space-x-2
          ${isPlaying 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
          }
        `}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span>Play</span>
      </button>

      <button
        onClick={onStop}
        disabled={!isPlaying}
        className={`
          w-full py-3 px-4 rounded-lg font-medium
          transition-all duration-200 ease-in-out
          flex items-center justify-center space-x-2
          ${!isPlaying 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
          }
        `}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
        <span>Stop</span>
      </button>
    </div>
  );
}
