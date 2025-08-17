"use client"

import { useState } from "react";
import { Button, Input, Select } from "@/components/common";
import { X } from "lucide-react";
import { KEY_MAPPING } from "@/config/key-mapping";
import { useApp } from "@/hooks/useApp";

export default function ControllerModal() {
  const { setIsControllerModalOpen, setSelectedSpriteForController, selectedSpriteForController, isControllerModalOpen } = useApp();
  const [config, setConfig] = useState<ControllerProps>({
      keywords: {
        up: "w",
        down: "s",
        left: "a",
        right: "d",
        jump: " "
      },
      status: {
        up: ["0(10)"],
        down: ["0(10)"],
        left: ["0(10)"],
        right: ["0(10)"],
        jump: ["0(10)"],
        idle: ["0(10)"]
      },
      speed: 5
    }
  );

  const handleConfigChange = (
    action: keyof ControllerProps['keywords'] | 'idle',
    field: 'key' | 'pattern',
    value: string
  ) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      if (field === 'key' && action !== 'idle') {
        newConfig.keywords[action as keyof ControllerProps['keywords']] = value;
      } else if (field === 'pattern') {
        newConfig.status[action] = [value];
      }
      return newConfig;
    });
  };

  const handleSpeedChange = (value: number) => {
    setConfig(prev => ({
      ...prev,
      speed: value
    }));
  };

  const handleCancel = () => {
    setIsControllerModalOpen(false);
    setSelectedSpriteForController(null);
  };

  const handleSave = () => {
    selectedSpriteForController?.manager.controller(config);
    handleCancel();
  };

  const REVERSE_KEY_MAPPING = Object.fromEntries(
    Object.entries(KEY_MAPPING).map(([label, value]) => [value, label])
  );

  if (!isControllerModalOpen) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-md p-6 relative">
        <Button onClick={handleCancel} size="icon" variant="ghost" className="absolute top-3 right-3">
          <X className="w-6 h-6" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create Controller
        </h3>
        <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</label>
            <div className="space-y-3">
              {(['up', 'down', 'left', 'right', 'jump', 'idle'] as const).map((action) => {
                const usedKeys = Object.values(config.keywords);
                return (
                  <div key={action} className="grid grid-cols-[80px_1fr_1fr] gap-3 items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{action}</span>
                    {action !== 'idle' ? (
                      <Select
                        value={REVERSE_KEY_MAPPING[config.keywords[action]]}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const label = e.target.value;
                          const newKey = KEY_MAPPING[label as keyof typeof KEY_MAPPING];
                          handleConfigChange(action, 'key', newKey);
                        }}
                        variant="filled"
                      >
                        {Object.keys(KEY_MAPPING).map((label) => {
                          const value = KEY_MAPPING[label as keyof typeof KEY_MAPPING];
                          const isUsedByOtherAction = usedKeys.includes(value) && config.keywords[action] !== value;
                          return (
                            <option key={label} value={label} disabled={isUsedByOtherAction}>
                              {label}
                            </option>
                          );
                        })}
                      </Select>
                    ) : <div />}
                    <Input
                      type="text"
                      value={config.status[action]?.[0] || ''}
                      onChange={(e) => handleConfigChange(action, 'pattern', e.target.value)}
                      placeholder="Pattern (e.g., 4:7)"
                      variant="filled"
                      fullWidth
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Movement Speed: {config.speed}x
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={config.speed}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1x</span>
              <span>10x</span>
            </div>
          </div>

          <Button
            onClick={handleSave}
            variant="primary"
            fullWidth
            size="lg"
          >
            Create Controller
          </Button>
        </div>
      </div>
    </div>
  );
}
