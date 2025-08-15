"use client"

interface StatusSectionProps {
  isPlaying: boolean;
  playingCount?: number;
}

export default function StatusSection({ isPlaying, playingCount = 0 }: StatusSectionProps) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className={`
          w-3 h-3 rounded-full
          ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}
        `}></div>
        <span className="text-gray-300">
          {isPlaying ? `Running (${playingCount} sprite${playingCount !== 1 ? 's' : ''})` : 'Stopped'}
        </span>
      </div>
    </div>
  );
}
