import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AlertMessageContext = createContext();

export const AlertMessageProvider = ({ children }) => {
  const [alertMessageState, setAlertMessageState] = useState({
    toasts: [],
    background: 'light',
    color: 'black'
  });

  const addToast = (heading, message, background = 'light', color = 'black') => {
    const id = new Date().getTime(); // Generate a unique ID based on current timestamp

    setAlertMessageState((prevState) => ({
      ...prevState,
      toasts: [
        ...prevState.toasts,
        { id, heading, show: true, message, background, color }
      ],
    }));

    setTimeout(() => {
      removeToast(id);
    }, 10000);
  };

  const removeToast = (id) => {
    setAlertMessageState((prevState) => ({
      ...prevState,
      toasts: prevState.toasts.filter((toast) => toast.id !== id),
    }));
  };

  return (
    <AlertMessageContext.Provider value={{ alertMessageState, addToast, removeToast }}>
      {children}
    </AlertMessageContext.Provider>
  );
};

AlertMessageProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAlertMessage = () => {
  return useContext(AlertMessageContext);
};