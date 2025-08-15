"use client"

import { useState } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import { Button, Select } from "@/components/common";

interface SpriteSlotProps {
  sprite: Sprite;
  isSelected: boolean;
  isPlaying: boolean;
  onDelete: (sprite: Sprite) => void;
}

export default function SpriteSlot({
  sprite,
  isSelected,
  isPlaying,
  onDelete
}: SpriteSlotProps) {
  const [, forceUpdate] = useState({});

  const handleTogglePlay = () => {
    if (sprite.isPlaying()) {
      sprite.pause();
    } else {
      sprite.play();
    }
    forceUpdate({});
  };

  const handleSpeedChange = (speed: number) => {
    sprite.setSpeed(speed);
    forceUpdate({});
  };

  const handleDelete = () => {
    onDelete(sprite);
  };

  const handleDebugToggle = () => {
    sprite.setDebug(!sprite.debug);
    forceUpdate({});
  };

  return (
    <div 
      className={`
        relative flex-shrink-0 w-full h-full bg-gray-700/40 rounded-lg border transition-all duration-200
        ${isSelected 
          ? 'border-blue-400/60 bg-gradient-to-br from-blue-500/10 to-blue-600/5 shadow-lg shadow-blue-500/20' 
          : 'border-gray-600/40 hover:border-gray-500/60'
        }
        ${isPlaying 
          ? 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
          : ''
        }
      `}
    >
      <div className="absolute top-0 left-0 right-0 h-1 flex rounded-t-lg overflow-hidden">
        {isSelected && (
          <div className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500" />
        )}
        {isPlaying && (
          <div className="flex-1 bg-gradient-to-r from-green-400 to-green-500 animate-pulse" />
        )}
      </div>

      <div className="p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-300 truncate min-w-0">
              Sprite #{sprite.id}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {isSelected && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <Button
              onClick={handleDelete}
              variant="danger"
              className="w-4 h-4 bg-red-500/80 hover:bg-red-500 rounded-full p-0 min-h-0 min-w-0"
              title="Delete sprite"
            >
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-gray-800/50 rounded border border-gray-600/30 mb-2 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs text-gray-500">
              {sprite.spriteGrid.rows}×{sprite.spriteGrid.cols}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleTogglePlay}
            variant={isPlaying ? "danger" : "success"}
            className="w-full h-8 space-x-2"
          >
            {isPlaying ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM13 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Pause</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Play</span>
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-8">Speed</span>
            <Select
              value={sprite.speed || 1}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              variant="filled"
              className="flex-1 text-xs px-2 py-1"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-8">Loop</span>
            <Button
              onClick={() => {
                sprite.setLoop(!sprite.loop);
                forceUpdate({});
              }}
              variant={sprite.loop ? "primary" : "ghost"}
              className={`flex-1 h-6 text-xs ${
                !sprite.loop ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-300 border border-gray-500/50' : ''
              }`}
            >
              {sprite.loop ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-8">Debug</span>
            <Button
              onClick={handleDebugToggle}
              variant={sprite.debug ? "primary" : "ghost"}
              className={`flex-1 h-6 text-xs ${
                !sprite.debug ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-300 border border-gray-500/50' : ''
              }`}
            >
              {sprite.debug ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
