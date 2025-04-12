import { createContext, useContext, useState, ReactNode } from "react";

type ScreenContextType = {
  currentScreen: string;
  setScreen: (screen: string) => void;
};

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState("Projects");
  return (
    <ScreenContext.Provider value={{ currentScreen, setScreen: setCurrentScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};
