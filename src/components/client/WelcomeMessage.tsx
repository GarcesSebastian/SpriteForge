"use client"

import React from 'react';

interface WelcomeMessageProps {
  isVisible: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      <div className="text-center text-gray-400/60 select-none">
        <div className="text-2xl font-light mb-3">
          Bienvenido a SpriteTools
        </div>
        <div className="text-lg text-gray-500/50">
          Crea y anima sprites • Experimenta con las herramientas
        </div>
        <div className="text-base text-gray-600/40 mt-4">
          Comienza creando tu primer sprite
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
