"use client"

import { Sprite } from "@/lib/instances/_shapes/Sprite";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import PanelHeader from "./panel/PanelHeader";
import PanelFooter from "./panel/PanelFooter";
import GameControlsSection from "./panel/GameControlsSection";
import StatusSection from "./panel/StatusSection";
import SpritesSection from "./panel/SpritesSection";

interface TestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  sprites: Sprite[];
  onDeleteSprite: (sprite: Sprite) => void;
}

export default function TestPanel({
  isOpen,
  onClose,
  isPlaying,
  onPlay,
  onStop,
  sprites,
  onDeleteSprite
}: TestPanelProps) {

  return (
    <>
      <button
        onClick={onClose}
        className={`
          fixed top-6 right-6 z-50
          w-12 h-12 rounded-full
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-700 hover:to-blue-700
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          group
          ${isOpen ? 'rotate-45' : 'hover:scale-110'}
        `}
      >
        <svg 
          className="w-6 h-6 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          )}
        </svg>
      </button>

      <div className={`
        fixed top-0 right-0 h-full w-96 z-40
        bg-gray-800/95 backdrop-blur-lg border-l border-gray-700
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        shadow-2xl
      `}>
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

      {isOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}
