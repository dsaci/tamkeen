import React, { useEffect } from 'react';
import { useSmartSection } from '../../contexts/SmartSectionContext';

const GlobalCollapseControl = () => {
  const { globalState, setGlobalState } = useSmartSection();

  const handleOpenAll = () => setGlobalState('open');
  const handleCloseAll = () => setGlobalState('closed');

  useEffect(() => {
    if (globalState === 'open' || globalState === 'closed') {
      const timer = setTimeout(() => setGlobalState(null), 350);
      return () => clearTimeout(timer);
    }
  }, [globalState]);

  return (
      <div className="flex items-center gap-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full overflow-x-auto">
        <span className="text-gray-700 dark:text-gray-200 font-semibold me-auto shrink-0">
          التحكم بالأقسام
        </span>
        <button 
          onClick={handleOpenAll}
          className="px-4 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none shrink-0"
        >
          فتح الكل
        </button>
        <button 
          onClick={handleCloseAll}
          className="px-4 py-2 min-h-[44px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none shrink-0"
        >
          طي الكل
        </button>
      </div>
  );
};

export default GlobalCollapseControl;
