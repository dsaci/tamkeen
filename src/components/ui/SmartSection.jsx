import React, { useState, useEffect, memo } from 'react';
import { useSmartSection } from '../../contexts/SmartSectionContext';

const SmartSection = memo(({ title, children, sectionKey, defaultOpen = true }) => {
  const { globalState } = useSmartSection();

  // 1. Initial State Priority: localStorage first, then defaultOpen
  const [isOpen, setIsOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(sectionKey);
      if (stored !== null) {
        return stored === 'true'; // Apply localStorage value if exists
      }
      return defaultOpen; // Apply default if nothing in localStorage
    } catch (error) {
      // Graceful fallback if localStorage is unavailable
      return defaultOpen;
    }
  });

  // 2. Listen for global state changes (Read-Only)
  useEffect(() => {
    if (globalState === 'open') {
      setIsOpen(true);
    } else if (globalState === 'closed') {
      setIsOpen(false);
    }
  }, [globalState]);

  // 3. Sync local state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(sectionKey, String(isOpen));
    } catch (error) {
      // Fail silently for Private Mode / Storage Full
    }
  }, [isOpen, sectionKey]);

  return (
    <div className="w-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden mb-4 transition-colors duration-300">
      
      {/* Target strictly accessible interactive button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${sectionKey}-content`}
        className="flex items-center justify-between w-full p-4 md:p-5 min-h-[44px] hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200"
      >
        <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        
        {/* Animated Chevron */}
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ease-in-out shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content with CSS-only max-height animation */}
      <div
        id={`${sectionKey}-content`}
        style={{
          maxHeight: isOpen ? '2000px' : '0px',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out'
        }}
        className=""
      >
        <div className="p-4 md:p-5 pt-0 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
});

SmartSection.displayName = 'SmartSection';

export default SmartSection;
