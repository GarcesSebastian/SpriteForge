"use client"

import { Sprite } from "@/lib/instances/_shapes/Sprite";

interface SpriteItemProps {
  sprite: Sprite;
  index: number;
  onToggle: (sprite: Sprite) => void;
  onDelete: (sprite: Sprite) => void;
  onSpeedChange?: (sprite: Sprite, speed: number) => void;
  onLoopChange?: (sprite: Sprite, loop: boolean) => void;
  onDebugChange?: (sprite: Sprite, debug: boolean) => void;
}

export default function SpriteItem({
  sprite,
  index,
  onToggle,
  onDelete,
  onSpeedChange,
  onLoopChange,
  onDebugChange
}: SpriteItemProps) {
  
  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    onSpeedChange?.(sprite, newSpeed);
  };

  const handleLoopToggle = () => {
    const newLoop = !sprite.loop;
    onLoopChange?.(sprite, newLoop);
  };

  const handleDebugToggle = () => {
    const newDebug = !sprite.isDebugging();
    onDebugChange?.(sprite, newDebug);
  };
  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">{index + 1}</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              Sprite {index + 1}
            </p>
            <p className="text-gray-400 text-xs">
              {sprite.spriteGrid.rows}×{sprite.spriteGrid.cols} frames
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(sprite)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onToggle(sprite)}
          className={`flex-1 py-2 px-3 text-white text-xs rounded-md transition-colors flex items-center justify-center space-x-1 ${
            sprite.isPlaying() 
              ? 'bg-yellow-600 hover:bg-yellow-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {sprite.isPlaying() ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
          <span>{sprite.isPlaying() ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Speed:</label>
            <span className="text-xs text-gray-300 font-medium">{(sprite.speed ?? 1).toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={sprite.speed ?? 1}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((sprite.speed ?? 1) / 10) * 100}%, #4b5563 ${((sprite.speed ?? 1) / 10) * 100}%, #4b5563 100%)`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Loop:</label>
          <button
            onClick={handleLoopToggle}
            className={`
              px-3 py-1 text-xs rounded-md font-medium transition-colors
              flex items-center space-x-1
              ${sprite.loop 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              {sprite.loop ? (
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
              )}
            </svg>
            <span>{sprite.loop ? 'Repeat' : 'Once'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Debug:</label>
          <button
            onClick={handleDebugToggle}
            className={`
              px-3 py-1 text-xs rounded-md font-medium transition-colors
              flex items-center space-x-1
              ${sprite.isDebugging() 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              {sprite.isDebugging() ? (
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              )}
            </svg>
            <span>{sprite.isDebugging() ? 'On' : 'Off'}</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Position:</span>
            <span>({Math.round(sprite.position.x)}, {Math.round(sprite.position.y)})</span>
          </div>
          <div className="flex justify-between">
            <span>Source:</span>
            <span className="truncate ml-2 max-w-32">{sprite.src.split('/').pop()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
