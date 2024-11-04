// app/context/ParentModeContext.tsx
"use client"; // Ensure this is here to make it a Client Component

import { createContext, useContext, useState, ReactNode } from "react";

interface ParentModeContextType {
  isParentMode: boolean;
  toggleParentMode: () => void;
  isParentRestrictionEnabled: boolean;
  toggleParentRestrictionMode: () => void;
}

const ParentModeContext = createContext<ParentModeContextType | undefined>(undefined);

export const ParentModeProvider = ({ children }: { children: ReactNode }) => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [isParentRestrictionEnabled, setIsParentRestrictionEnabled] = useState(false);

  const toggleParentMode = () => setIsParentMode(!isParentMode);
  const toggleParentRestrictionMode = () => setIsParentRestrictionEnabled(!isParentRestrictionEnabled);

  return (
    <ParentModeContext.Provider value={{ isParentMode, toggleParentMode, isParentRestrictionEnabled, toggleParentRestrictionMode }}>
      {children}
    </ParentModeContext.Provider>
  );
};

export const useParentMode = () => {
  const context = useContext(ParentModeContext);
  if (!context) {
    throw new Error("useParentMode must be used within a ParentModeProvider");
  }
  return context;
};
