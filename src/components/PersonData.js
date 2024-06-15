import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const PersonDataContext = createContext();

export const PersonDataProvider = ({ children }) => {
  const [personDataState, setPersonDataState] = useState({
    person: [],
    files: [],
    fileTypes: [],
    crewTypes: [],
    timesheetAccess: [],
    forms: [],
    quals: []
  });

  return (
    <PersonDataContext.Provider value={{ personDataState, setPersonDataState }}>
      {children}
    </PersonDataContext.Provider>
  );
};

PersonDataProvider.propTypes = {
  children: PropTypes.object.isRequired
};
export const usePersonData = () => {
  return useContext(PersonDataContext);
};
