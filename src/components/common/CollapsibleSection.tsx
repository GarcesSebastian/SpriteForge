"use client"

import { useState, ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  icon,
  className = ""
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-6 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        
        <svg
          className={`w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-all duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
      }`}>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
