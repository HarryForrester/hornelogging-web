import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const LibraryFileContext = createContext();

export const LibraryFileProvider = ({ children }) => {
  const [libraryFiles, setLibraryFiles] = useState({
    libraryFileTypes: [],
    libraryFiles: [],    
  });

  return <LibraryFileContext.Provider value={{ libraryFiles, setLibraryFiles }}>{children}</LibraryFileContext.Provider>;
};

LibraryFileProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useLibraryFile = () => {
  return useContext(LibraryFileContext);
};
