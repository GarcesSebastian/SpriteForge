"use client"

import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  variant?: 'default' | 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
}

const Range = forwardRef<HTMLInputElement, RangeProps>(({
  variant = 'default',
  size = 'md',
  label,
  description,
  error,
  fullWidth = false,
  showValue = true,
  showMinMax = true,
  formatValue,
  className,
  min = 0,
  max = 100,
  value,
  ...props
}, ref) => {
  const baseClasses = "appearance-none cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  
  const variantClasses = {
    default: "bg-gray-200 dark:bg-gray-700 focus:ring-gray-500",
    primary: "bg-purple-200 dark:bg-purple-800 focus:ring-purple-500",
    success: "bg-green-200 dark:bg-green-800 focus:ring-green-500",
    danger: "bg-red-200 dark:bg-red-800 focus:ring-red-500"
  };

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    error && "ring-2 ring-red-500 ring-offset-2",
    className
  );

  const currentValue = Number(value) || Number(min) || 0;
  const displayValue = formatValue ? formatValue(currentValue) : currentValue.toString();

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {showValue && (
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {displayValue}
            </span>
          )}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={value}
        className={classes}
        {...props}
      />

      {showMinMax && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatValue ? formatValue(Number(min)) : min}</span>
          <span>{formatValue ? formatValue(Number(max)) : max}</span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Range.displayName = "Range";

export default Range;
