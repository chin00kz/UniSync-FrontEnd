import React, { useState } from 'react';

/**
 * SearchBar — reusable search input.
 * Props:
 *   value       {string}   controlled value
 *   onChange    {fn}       (value: string) => void
 *   placeholder {string}
 */
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="search-container animate-fade-in">
      {/* Magnifier icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: isFocused ? 'var(--primary-blue)' : '#9ca3af',
          pointerEvents: 'none',
          transition: 'color 0.3s ease'
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{ 
          color: 'var(--text-main)',
        }}
      />
    </div>
  );
}
