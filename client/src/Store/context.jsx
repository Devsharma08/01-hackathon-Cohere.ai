import React, { createContext, useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../Pages/Chat";

const chatcontext = createContext();
const Provider = ({children}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    console.log('I am getting called');
    
    setShowSidebar(!showSidebar);
  };
  return (
    <chatcontext.Provider value={{ toggleSidebar,showSidebar }}>
      {children}
    </chatcontext.Provider>
  );
};
export const useChatContext = () => useContext(chatcontext)
export default Provider;
