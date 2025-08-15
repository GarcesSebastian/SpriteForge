"use client"

import { useState, useRef, useEffect } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import SpriteSlot from "@/components/client/panel/SpriteSlot";

interface BottomPanelProps {
  sprites: Sprite[];
  selectedSprites: Sprite[];
  playingSprites: Sprite[];
  onDeleteSprite: (sprite: Sprite) => void;
}

export default function BottomPanel({
  sprites,
  selectedSprites,
  playingSprites,
  onDeleteSprite
}: BottomPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [panelHeight, setPanelHeight] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const minHeight = 120;
  const maxHeight = 400;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newHeight = window.innerHeight - e.clientY;
      const clampedHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
      setPanelHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  return (
    <div 
      ref={panelRef}
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-gray-800/95 backdrop-blur-lg border-t border-gray-700
        shadow-2xl transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'translate-y-full' : 'translate-y-0'}
      `}
      style={{ height: isCollapsed ? '40px' : `${panelHeight}px` }}
    >
      <div
        ref={resizeRef}
        onMouseDown={handleResizeStart}
        className={`
          absolute top-0 left-0 right-0 h-1 cursor-ns-resize
          bg-gray-600 hover:bg-gray-500 transition-colors duration-200
          ${isResizing ? 'bg-blue-500' : ''}
        `}
      />

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          absolute top-0 right-4 -translate-y-full
          w-12 h-8 bg-gray-800/95 backdrop-blur-lg
          border border-b-0 border-gray-700 rounded-t-lg
          flex items-center justify-center
          hover:bg-gray-700/95 transition-colors duration-200
          shadow-lg z-10
        "
      >
        <svg 
          className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 15l7-7 7 7" 
          />
        </svg>
      </button>

      <div className="h-full flex flex-col pt-2 pb-4 px-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-200">
              Sprites ({sprites.length})
              {selectedSprites.length > 0 && (
                <span className="ml-2 text-blue-400">• {selectedSprites.length} selected</span>
              )}
              {playingSprites.length > 0 && (
                <span className="ml-2 text-green-400">• {playingSprites.length} playing</span>
              )}
            </h3>
          </div>
          
          <div className="text-xs text-gray-400">
            Height: {panelHeight}px
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {sprites.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-sm">No sprites loaded</p>
                <p className="text-gray-500 text-xs mt-1">Create sprites using the toolbar above</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="grid gap-3 pb-2 auto-rows-max" style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(192px, 1fr))'
              }}>
                {sprites.map((sprite) => {
                  const isSelected = selectedSprites.some(selected => selected.id === sprite.id);
                  const isPlaying = playingSprites.some(playing => playing.id === sprite.id);
                  
                  return (
                    <SpriteSlot
                      key={sprite.id}
                      sprite={sprite}
                      isSelected={isSelected}
                      isPlaying={isPlaying}
                      onDelete={onDeleteSprite}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
