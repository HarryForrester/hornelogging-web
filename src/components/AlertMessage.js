import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AlertMessageContext = createContext();

export const AlertMessageProvider = ({ children }) => {
  const [alertMessageState, setAlertMessageState] = useState({
    //show: false,
    //time: null,
    //heading: null,
    //message: null,
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
  children: PropTypes.func.isRequired,
}

export const useAlertMessage = () => {
  return useContext(AlertMessageContext);
};
