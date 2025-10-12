import { useState, createContext, useContext } from "react";

const PopupContext = createContext(null);

function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  return (
    <PopupContext.Provider value={{ popup, setPopup }}>
      {children}
    </PopupContext.Provider>
  );
}
export const usePopup = () => {
  return useContext(PopupContext);
};

export default PopupProvider;