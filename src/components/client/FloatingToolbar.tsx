"use client"

import { useState, useRef, useEffect } from "react";
import { SpriteProps } from "@/lib/instances/_shapes/Sprite";
import { CircleProps } from "@/lib/instances/_shapes/Circle";
import { RectProps } from "@/lib/instances/_shapes/Rect";
import { Vector } from "@/lib/common/Vector";

interface FloatingToolbarProps {
  onCreateSprite: (props: SpriteProps) => void;
}

type DropdownType = 'sprite' | 'circle' | 'rect' | null;

export default function FloatingToolbar({
  onCreateSprite,
}: FloatingToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [spriteForm, setSpriteForm] = useState({
    src: '',
    rows: 1,
    cols: 1,
    scale: 1,
    speed: 1,
    loop: true,
    x: 100,
    y: 100
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [circleForm, setCircleForm] = useState({
    radius: 50,
    color: '#3b82f6',
    x: 100,
    y: 100
  });

  const [rectForm, setRectForm] = useState({
    width: 100,
    height: 100,
    color: '#10b981',
    x: 100,
    y: 100
  });

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
    
    onCreateSprite({
      position: new Vector(spriteForm.x, spriteForm.y),
      src: spriteForm.src,
      spriteGrid: { rows: spriteForm.rows, cols: spriteForm.cols },
      scale: spriteForm.scale,
      speed: spriteForm.speed,
      loop: spriteForm.loop
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
            <input
              type="text"
              value={spriteForm.src}
              onChange={(e) => setSpriteForm({...spriteForm, src: e.target.value})}
              placeholder="Enter image URL or path"
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Image</span>
              </button>
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
            <input
              type="number"
              min="1"
              value={spriteForm.rows}
              onChange={(e) => setSpriteForm({...spriteForm, rows: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Cols</label>
            <input
              type="number"
              min="1"
              value={spriteForm.cols}
              onChange={(e) => setSpriteForm({...spriteForm, cols: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Scale</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={spriteForm.scale}
              onChange={(e) => setSpriteForm({...spriteForm, scale: parseFloat(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Speed</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={spriteForm.speed}
              onChange={(e) => setSpriteForm({...spriteForm, speed: parseFloat(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="loop"
            checked={spriteForm.loop}
            onChange={(e) => setSpriteForm({...spriteForm, loop: e.target.checked})}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="loop" className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">Loop Animation</label>
        </div>

        <button
          onClick={handleCreateSprite}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
        >
          Create Sprite
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed top-6 left-6 z-40" ref={dropdownRef}>
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-3">
        <div className="flex space-x-1">
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'sprite' ? null : 'sprite')}
              className={`group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
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
            </button>
            {activeDropdown === 'sprite' && renderSpriteDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}
