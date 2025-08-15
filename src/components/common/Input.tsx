"use client"

import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'ghost' | 'filled';
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  label,
  description,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
    ghost: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
    filled: "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
  };

  const sizeClasses = "px-3 py-2 text-sm rounded-lg";
  const widthClasses = fullWidth ? "w-full" : "";
  const errorClasses = error ? "border-red-500 dark:border-red-400 focus:ring-red-500" : "";

  const inputClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses,
    widthClasses,
    errorClasses,
    leftIcon && "pl-10",
    rightIcon && "pr-10",
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
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
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

Input.displayName = "Input";

export default Input;
