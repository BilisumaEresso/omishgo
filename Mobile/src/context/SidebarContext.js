import { createContext, useCallback, useContext, useState } from "react";
import AppSidebar from "../components/layout/AppSidebar.js";
import { navigateFromSidebar } from "../utils/sidebarNavigation.js";

const SidebarContext = createContext({
  openSidebar: () => {},
  closeSidebar: () => {},
});

export function SidebarProvider({ children, role, navigation, onSwitchTab }) {
  const [visible, setVisible] = useState(false);

  const openSidebar = useCallback(() => setVisible(true), []);
  const closeSidebar = useCallback(() => setVisible(false), []);

  const handleItemPress = useCallback(
    (item) => {
      setVisible(false);
      navigateFromSidebar({ item, navigation, onSwitchTab, role });
    },
    [navigation, onSwitchTab, role],
  );

  return (
    <SidebarContext.Provider value={{ openSidebar, closeSidebar }}>
      {children}
      <AppSidebar
        visible={visible}
        onClose={closeSidebar}
        role={role}
        onItemPress={handleItemPress}
      />
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
