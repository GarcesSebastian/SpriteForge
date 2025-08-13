"use client"

import { useState } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import PanelHeader from "./panel/PanelHeader";
import PanelFooter from "./panel/PanelFooter";
import GameControlsSection from "./panel/GameControlsSection";
import StatusSection from "./panel/StatusSection";
import SpritesSection from "./panel/SpritesSection";

interface TestPanelProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  sprites: Sprite[];
  onDeleteSprite: (sprite: Sprite) => void;
}

export default function TestPanel({
  isPlaying,
  onPlay,
  onStop,
  sprites,
  onDeleteSprite
}: TestPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
      fixed top-0 right-0 h-full w-96 z-40
      bg-gray-800/95 backdrop-blur-lg border-l border-gray-700
      shadow-2xl transition-transform duration-300 ease-in-out
      ${isCollapsed ? 'translate-x-full' : 'translate-x-0'}
    `}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
            w-8 h-16 bg-gray-800/95 backdrop-blur-lg
            border border-r-0 border-gray-700 rounded-l-lg
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
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>

        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <PanelHeader />

          <CollapsibleSection 
            title="Game Controls" 
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            }
          >
            <GameControlsSection
              isPlaying={isPlaying}
              onPlay={onPlay}
              onStop={onStop}
            />
          </CollapsibleSection>

          <CollapsibleSection 
            title="Status" 
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            }
          >
            <StatusSection isPlaying={isPlaying} />
          </CollapsibleSection>

          <CollapsibleSection 
            title={`Sprites (${sprites.length})`}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            }
            className="flex-1"
          >
            <SpritesSection
              sprites={sprites}
              onDeleteSprite={onDeleteSprite}
            />
          </CollapsibleSection>

          <PanelFooter />
        </div>
    </div>
  );
}
