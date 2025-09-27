"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  pages: string[];
  currentPageIndex: number;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToPage: (index: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pages = ['/', '/capture', '/char', '/story'];
  
  // This provider mainly serves as a way to share navigation configuration
  // The actual navigation logic is handled by the useKeyNavigation hook
  const contextValue: NavigationContextType = {
    pages,
    currentPageIndex: 0, // This will be overridden by the hook
    navigateToNext: () => {}, // These will be overridden by the hook
    navigateToPrevious: () => {},
    navigateToPage: () => {},
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}