"use client"

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Share2 } from 'lucide-react';
import { Button } from "@/components/common";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SpriteCreationForm from "./floating-toolbar/SpriteCreationForm";
import MobileSpriteCreationForm from "./floating-toolbar/MobileSpriteCreationForm";
import ShareForm from './floating-toolbar/ShareForm';
import { signIn, signOut, useSession } from "next-auth/react";

interface FloatingToolbarProps {
  onCreateSprite: (props: SpriteProps) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

type DropdownType = 'sprite' | 'share' | null;

export default function FloatingToolbar({
  onCreateSprite,
  isPlaying,
  onPlay,
  onStop,
}: FloatingToolbarProps) {
  const { data: session } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!isMobile) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const handleCloseForm = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-40" ref={dropdownRef}>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-3">
          <div className="flex items-center space-x-1">
            <Button
              onClick={isPlaying ? onStop : onPlay}
              variant={isPlaying ? "danger" : "success"}
              size="icon"
              className="group relative hover:scale-105 active:scale-95"
              title={isPlaying ? "Stop Render" : "Start Render"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </Button>

            <div className="relative">
              <Button
                onClick={() => setActiveDropdown(activeDropdown === 'sprite' ? null : 'sprite')}
                variant="primary"
                size="icon"
                className={`group relative hover:scale-105 active:scale-95 ${
                  activeDropdown === 'sprite' ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
                }`}
                title="Create Sprite"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Button>
              {activeDropdown === 'sprite' && !isMobile && (
                  <SpriteCreationForm onCreateSprite={onCreateSprite} onClose={handleCloseForm} />
              )}
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

            {session && session.user ? (
              <>
                <div className="relative">
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    size="icon"
                    className="group relative hover:scale-105 active:scale-95"
                    title={`Logout ${session.user.name}`}
                  >
                    <img src={session.user.image!} alt={session.user.name!} className="w-9 h-9 rounded-full" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <LogOut className="w-5 h-5 text-white" />
                    </div>
                  </Button>
                </div>
                <div className="relative">
                  <Button
                    onClick={() => setActiveDropdown(activeDropdown === 'share' ? null : 'share')}
                    variant="ghost"
                    size="icon"
                    className={`group relative hover:scale-105 active:scale-95 ${
                      activeDropdown === 'share' ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
                    }`}
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white" />
                  </Button>
                  {activeDropdown === 'share' && <ShareForm onClose={handleCloseForm} />}
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn('google')}
                variant="auth"
                size="icon"
                className="group relative hover:scale-105 active:scale-95"
                title="Authenticate"
              >
                <User className="w-5 h-5 text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {activeDropdown === 'sprite' && isMobile && (
        <MobileSpriteCreationForm onCreateSprite={onCreateSprite} onClose={handleCloseForm} />
      )}
    </>
  );
}