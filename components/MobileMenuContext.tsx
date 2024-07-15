// MenuContext.tsx
import { createContext, useContext, useState } from "react";

const MobileMenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (isOpen: boolean) => {},
});

export const useMenu = () => useContext(MobileMenuContext);

// @ts-ignore
export const MobileMenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
};
