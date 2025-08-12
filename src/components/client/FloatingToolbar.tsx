"use client"

import { useState, useRef, useEffect } from "react";
import { SpriteProps } from "@/lib/instances/_shapes/Sprite";
import { CircleProps } from "@/lib/instances/_shapes/Circle";
import { RectProps } from "@/lib/instances/_shapes/Rect";
import { Vector } from "@/lib/common/Vector";

interface FloatingToolbarProps {
  onCreateSprite: (props: SpriteProps) => void;
  onCreateCircle: (props: CircleProps) => void;
  onCreateRect: (props: RectProps) => void;
}

type DropdownType = 'sprite' | 'circle' | 'rect' | null;

export default function FloatingToolbar({
  onCreateSprite,
  onCreateCircle,
  onCreateRect
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

  const handleCreateCircle = () => {
    onCreateCircle({
      position: new Vector(circleForm.x, circleForm.y),
      radius: circleForm.radius,
      color: circleForm.color
    });
    setActiveDropdown(null);
  };

  const handleCreateRect = () => {
    onCreateRect({
      position: new Vector(rectForm.x, rectForm.y),
      width: rectForm.width,
      height: rectForm.height,
      color: rectForm.color
    });
    setActiveDropdown(null);
  };

  const renderSpriteDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Create Sprite</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Image Source</label>
          <input
            type="text"
            value={spriteForm.src}
            onChange={(e) => setSpriteForm({...spriteForm, src: e.target.value})}
            placeholder="Enter image URL or path"
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position X</label>
            <input
              type="number"
              value={spriteForm.x}
              onChange={(e) => setSpriteForm({...spriteForm, x: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position Y</label>
            <input
              type="number"
              value={spriteForm.y}
              onChange={(e) => setSpriteForm({...spriteForm, y: parseInt(e.target.value) || 0})}
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

  const renderCircleDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Create Circle</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Radius</label>
          <input
            type="number"
            min="1"
            value={circleForm.radius}
            onChange={(e) => setCircleForm({...circleForm, radius: parseInt(e.target.value) || 1})}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={circleForm.color}
              onChange={(e) => setCircleForm({...circleForm, color: e.target.value})}
              className="w-12 h-10 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={circleForm.color}
              onChange={(e) => setCircleForm({...circleForm, color: e.target.value})}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position X</label>
            <input
              type="number"
              value={circleForm.x}
              onChange={(e) => setCircleForm({...circleForm, x: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position Y</label>
            <input
              type="number"
              value={circleForm.y}
              onChange={(e) => setCircleForm({...circleForm, y: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCreateCircle}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
        >
          Create Circle
        </button>
      </div>
    </div>
  );

  const renderRectDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Create Rectangle</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Width</label>
            <input
              type="number"
              min="1"
              value={rectForm.width}
              onChange={(e) => setRectForm({...rectForm, width: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Height</label>
            <input
              type="number"
              min="1"
              value={rectForm.height}
              onChange={(e) => setRectForm({...rectForm, height: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={rectForm.color}
              onChange={(e) => setRectForm({...rectForm, color: e.target.value})}
              className="w-12 h-10 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={rectForm.color}
              onChange={(e) => setRectForm({...rectForm, color: e.target.value})}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position X</label>
            <input
              type="number"
              value={rectForm.x}
              onChange={(e) => setRectForm({...rectForm, x: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position Y</label>
            <input
              type="number"
              value={rectForm.y}
              onChange={(e) => setRectForm({...rectForm, y: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCreateRect}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
        >
          Create Rectangle
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

          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'circle' ? null : 'circle')}
              className={`group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
                activeDropdown === 'circle' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
              }`}
              title="Create Circle"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              </svg>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Circle
              </div>
            </button>
            {activeDropdown === 'circle' && renderCircleDropdown()}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'rect' ? null : 'rect')}
              className={`group relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
                activeDropdown === 'rect' ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
              }`}
              title="Create Rectangle"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
              </svg>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Rectangle
              </div>
            </button>
            {activeDropdown === 'rect' && renderRectDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}
