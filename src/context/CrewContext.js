import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const CrewContext = createContext();

export const CrewProvider = ({ children }) => {
  const [crews, setCrews] = useState([]);

  return <CrewContext.Provider value={{ crews, setCrews }}>{children}</CrewContext.Provider>;
};

CrewProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useCrews = () => {
  return useContext(CrewContext);
};
