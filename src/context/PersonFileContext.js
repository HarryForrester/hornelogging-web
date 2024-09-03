import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const PersonFileContext = createContext();

export const PersonFileProvider = ({ children }) => {
  const [personFiles, setPersonFiles] = useState({
    personFileTypes: [],
    personFiles: [],    
  });

  return <PersonFileContext.Provider value={{ personFiles, setPersonFiles }}>{children}</PersonFileContext.Provider>;
};

PersonFileProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const usePersonFile = () => {
  return useContext(PersonFileContext);
};
