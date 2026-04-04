import React, { createContext, useContext, useState } from 'react';

const SmartSectionContext = createContext();

export const SmartSectionProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(null); // 'open' | 'closed' | null

  return (
    <SmartSectionContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </SmartSectionContext.Provider>
  );
};

export const useSmartSection = () => {
  const context = useContext(SmartSectionContext);
  if (context === undefined) {
    throw new Error('useSmartSection must be used within a SmartSectionProvider');
  }
  return context;
};
