"use client"

import { useState, useRef, useEffect } from "react";
import { SpriteProps } from "@/lib/instances/_shapes/Sprite";
import { Vector } from "@/lib/common/Vector";
import { Button, Input } from "@/components/common";

interface FloatingToolbarProps {
  onCreateSprite: (props: SpriteProps) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

type DropdownType = 'sprite' | 'circle' | 'rect' | null;

export default function FloatingToolbar({
  onCreateSprite,
  isPlaying,
  onPlay,
  onStop,
}: FloatingToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [spriteForm, setSpriteForm] = useState({
    src: '',
    rows: 1,
    cols: 1,
    ignoreFrames: '',
    pattern: '',
    x: 100,
    y: 100
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSpriteForm({...spriteForm, src: dataUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSprite = () => {
    if (!spriteForm.src.trim()) {
      alert('Please provide an image source');
      return;
    }

    const ignoreFrames: number[] = [];

    const ignoreFramesSplited = spriteForm.ignoreFrames.trim().split(",");
    ignoreFramesSplited.forEach((frame) => {
      const frameFormatted = Number(frame);
      if (!isNaN(frameFormatted)) {
        ignoreFrames.push(frameFormatted);
      }

      if (frame.includes(":")) {
        const [start, end] = frame.split(":").map(Number);
        for (let i = start; i <= end; i++) {
          ignoreFrames.push(i);
        }
      }
    });

    let pattern: string[] | undefined = undefined;
    if (spriteForm.pattern.trim()) {
      pattern = spriteForm.pattern.split(',').map(p => p.trim()).filter(p => p);
    }
    
    onCreateSprite({
      position: new Vector(spriteForm.x, spriteForm.y),
      src: spriteForm.src,
      spriteGrid: { rows: spriteForm.rows, cols: spriteForm.cols },
      ignoreFrames,
      pattern,
      dragging: true
    });
    setActiveDropdown(null);
  };

  const renderSpriteDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Create Sprite</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Image Source</label>
          <div className="space-y-2">
            <Input
              type="text"
              value={spriteForm.src}
              onChange={(e) => setSpriteForm({...spriteForm, src: e.target.value})}
              placeholder="Enter image URL or path"
              variant="default"
              fullWidth
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Image</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {spriteForm.src && spriteForm.src.startsWith('data:') && (
              <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Image uploaded successfully</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Rows</label>
            <Input
              type="number"
              min={1}
              value={spriteForm.rows}
              onChange={(e) => setSpriteForm({...spriteForm, rows: parseInt(e.target.value) || 1})}
              variant="default"
              fullWidth
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Cols</label>
            <Input
              type="number"
              min={1}
              value={spriteForm.cols}
              onChange={(e) => setSpriteForm({...spriteForm, cols: parseInt(e.target.value) || 1})}
              variant="default"
              fullWidth
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Pattern</label>
          <Input
            type="text"
            placeholder="Example: 1, 5, 6:12, 22:-1, 2x8, 1(5)"
            value={spriteForm.pattern}
            onChange={(e) => setSpriteForm({...spriteForm, pattern: e.target.value})}
            variant="default"
            fullWidth
            description="Define custom frame sequence. Leave empty to use start/end frames."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ignore Frames</label>
          <Input
            type="text"
            placeholder="Example: 0, 1, 2"
            value={spriteForm.ignoreFrames}
            onChange={(e) => setSpriteForm({...spriteForm, ignoreFrames: e.target.value})}
            variant="default"
            fullWidth
          />
        </div>

        <Button
          onClick={handleCreateSprite}
          variant="primary"
          fullWidth
        >
          Create Sprite
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed top-6 left-6 z-40" ref={dropdownRef}>
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-3">
        <div className="flex space-x-1">
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
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isPlaying ? 'Stop' : 'Play'}
            </div>
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
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Sprite
              </div>
            </Button>
            {activeDropdown === 'sprite' && renderSpriteDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}
