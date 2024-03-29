import { createContext, useContext, useState } from 'react';

const ConfirmationModalContext = createContext();

export const ConfirmationModalProvider = ({ children }) => {
  const [confirmationModalState, setConfirmationModalState] = useState({
    show: false,
    label: null,
    message: null,
    confirmed: false
  });

  return (
    <ConfirmationModalContext.Provider
      value={{ confirmationModalState, setConfirmationModalState }}
    >
      {children}
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmationModal = () => {
  return useContext(ConfirmationModalContext);
};

//confirmModalLabel: "Remove Map",
//confirmModalMessage: "Are you sure you wnt to delete map?"
