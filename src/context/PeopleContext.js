import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState({
    peopleByCrew: [],
    archivedPeople: []
  });

  return <PeopleContext.Provider value={{ people, setPeople }}>{children}</PeopleContext.Provider>;
};

PeopleProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const usePeople = () => {
  return useContext(PeopleContext);
};
