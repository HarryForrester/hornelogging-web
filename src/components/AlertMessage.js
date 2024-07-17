import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AlertMessageContext = createContext();

export const AlertMessageProvider = ({ children }) => {
  const [alertMessageState, setAlertMessageState] = useState({
    toasts: [],
    background: 'light',
    color: 'black'
  });

  return (
    <AlertMessageContext.Provider value={{ alertMessageState, setAlertMessageState }}>
      {children}
    </AlertMessageContext.Provider>
  );
};

AlertMessageProvider.propTypes = {
  children: PropTypes.node.isRequired // Changed from func to node
};

export const useAlertMessage = () => {
  return useContext(AlertMessageContext);
};
