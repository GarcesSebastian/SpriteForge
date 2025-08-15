"use client"

import { useState } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import SpriteItem from "./SpriteItem";

interface SpritesSectionProps {
  sprites: Sprite[];
  selectedSprites?: Sprite[];
  playingSprites?: Sprite[];
  onDeleteSprite: (sprite: Sprite) => void;
}

export default function SpritesSection({
  sprites,
  selectedSprites = [],
  playingSprites = [],
  onDeleteSprite
}: SpritesSectionProps) {
  const [, forceUpdate] = useState({});

  const handleSpriteToggle = (sprite: Sprite) => {
    if (sprite.isPlaying()) {
      sprite.pause();
    } else {
      sprite.play();
    }
    forceUpdate({});
  };

  const handleSpriteDelete = (sprite: Sprite) => {
    onDeleteSprite(sprite);
  };

  const handleSpeedChange = (sprite: Sprite, speed: number) => {
    sprite.setSpeed(speed);
    forceUpdate({});
  };

  const handleLoopChange = (sprite: Sprite, loop: boolean) => {
    sprite.setLoop(loop);
    forceUpdate({});
  };

  const handleDebugChange = (sprite: Sprite, debug: boolean) => {
    sprite.setDebug(debug);
    forceUpdate({});
  };

  if (sprites.length === 0) {
    return (
      <div className="bg-gray-700/30 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-sm">No sprites loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto overflow-x-hidden panel-scroll">
      {sprites.map((sprite, index) => {
        const isSelected = selectedSprites.some(selected => selected.id === sprite.id);
        const isPlaying = playingSprites.some(playing => playing.id === sprite.id);
        return (
          <div 
            key={sprite.id} 
            className={`
              relative transition-all duration-200 mx-1
              ${isSelected 
                ? 'bg-blue-500/10 border border-blue-400/40 rounded-lg shadow-lg shadow-blue-500/20' 
                : ''
              }
              ${isPlaying 
                ? 'ring-2 ring-green-400/50 bg-green-500/5' 
                : ''
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full z-10" />
            )}
            {isPlaying && (
              <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse z-10" />
            )}
            <SpriteItem
              sprite={sprite}
              index={index}
              onToggle={handleSpriteToggle}
              onDelete={handleSpriteDelete}
              onSpeedChange={handleSpeedChange}
              onLoopChange={handleLoopChange}
              onDebugChange={handleDebugChange}
            />
          </div>
        );
      })}
    </div>
  );
}
