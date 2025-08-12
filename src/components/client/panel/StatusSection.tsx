"use client"

interface StatusSectionProps {
  isPlaying: boolean;
}

export default function StatusSection({ isPlaying }: StatusSectionProps) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className={`
          w-3 h-3 rounded-full
          ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}
        `}></div>
        <span className="text-gray-300">
          {isPlaying ? 'Running' : 'Stopped'}
        </span>
      </div>
    </div>
  );
}
