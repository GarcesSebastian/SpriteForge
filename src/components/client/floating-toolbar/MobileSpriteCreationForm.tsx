"use client"

import { useRef } from 'react';
import { Button, Input } from '@/components/common';
import { useSpriteForm } from '@/controllers/useSpriteForm';
import { X } from 'lucide-react';

interface MobileSpriteCreationFormProps {
  onCreateSprite: (props: any) => void;
  onClose: () => void;
}

export default function MobileSpriteCreationForm({ onCreateSprite, onClose }: MobileSpriteCreationFormProps) {
  const { spriteForm, setSpriteForm, handleFileUpload, handleCreateSprite } = useSpriteForm({ onCreateSprite, onClose });
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-md p-6 relative">
        <Button onClick={onClose} size="icon" variant="ghost" className="absolute top-3 right-3">
          <X className="w-6 h-6" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Sprite</h3>
        <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Source</label>
            <div className="space-y-2">
              <Input
                type="text"
                value={spriteForm.src}
                onChange={(e) => setSpriteForm({ ...spriteForm, src: e.target.value })}
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
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Rows</label>
              <Input
                type="number"
                min={1}
                value={spriteForm.rows}
                onChange={(e) => setSpriteForm({ ...spriteForm, rows: parseInt(e.target.value) || 1 })}
                variant="default"
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Cols</label>
              <Input
                type="number"
                min={1}
                value={spriteForm.cols}
                onChange={(e) => setSpriteForm({ ...spriteForm, cols: parseInt(e.target.value) || 1 })}
                variant="default"
                fullWidth
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pattern</label>
            <Input
              type="text"
              placeholder="Example: 1, 5, 6:12, 22:-1, 2x8, 1(5)"
              value={spriteForm.pattern}
              onChange={(e) => setSpriteForm({ ...spriteForm, pattern: e.target.value })}
              variant="default"
              fullWidth
              description="Define custom frame sequence. Leave empty to use start/end frames."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ignore Frames</label>
            <Input
              type="text"
              placeholder="Example: 0, 1, 2"
              value={spriteForm.ignoreFrames}
              onChange={(e) => setSpriteForm({ ...spriteForm, ignoreFrames: e.target.value })}
              variant="default"
              fullWidth
            />
          </div>

          <Button
            onClick={handleCreateSprite}
            variant="primary"
            fullWidth
            size="lg"
          >
            Create Sprite
          </Button>
        </div>
      </div>
    </div>
  );
}
