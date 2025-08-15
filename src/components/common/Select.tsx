"use client"

import { SelectHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'ghost' | 'filled';
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  variant = 'default',
  label,
  description,
  error,
  fullWidth = false,
  className,
  children,
  ...props
}, ref) => {
  const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer";
  
  const variantClasses = {
    default: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-gray-100 [&>option]:py-2 [&>option]:px-3",
    ghost: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-gray-100 [&>option]:py-2 [&>option]:px-3",
    filled: "bg-gray-600/50 border border-gray-500/50 text-gray-200 focus:border-purple-400 hover:bg-gray-600/70 [&>option]:bg-gray-700 [&>option]:text-gray-100 [&>option]:py-2 [&>option]:px-3 [&>option:hover]:bg-gray-600 [&>option:checked]:bg-purple-600 [&>option:checked]:text-white"
  };

  const sizeClasses = "px-3 py-2 pr-8 text-sm rounded-lg";
  const widthClasses = fullWidth ? "w-full" : "";
  const errorClasses = error ? "border-red-500 dark:border-red-400 focus:ring-red-500" : "";

  const selectClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses,
    widthClasses,
    errorClasses,
    className
  );

  const containerClasses = twMerge(
    "relative",
    fullWidth ? "w-full" : ""
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {description && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
