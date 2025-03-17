// utils/SettingsPanelModeContext.js
import React, { createContext, useState } from "react";

export const SettingsPanelModeContext = createContext({
  mode: "half",
  setMode: () => {},
});

export const SettingsPanelModeProvider = ({ children }) => {
  const [mode, setMode] = useState("half");

  return (
    <SettingsPanelModeContext.Provider value={{ mode, setMode }}>
      {children}
    </SettingsPanelModeContext.Provider>
  );
};
