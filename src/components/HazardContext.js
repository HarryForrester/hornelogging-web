import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const HazardContext = createContext();

export const HazardProvider = ({ children }) => {
  const [hazardState, setHazardState] = useState({
    isCreateHazardModalVisible: false,
    isUpdateReviewModalVisible: false,
    isEditing: false,
    _id: null,
    title: null,
    sev: 'LOW',
    reviewDate: null,
    reviewReason: null,
    category: 'Health',
    harmFields: [{ category: '', description: [''] }]
  });

  return (
    <HazardContext.Provider value={{ hazardState, setHazardState }}>
      {children}
    </HazardContext.Provider>
  );
};

HazardProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useHazardState = () => {
  return useContext(HazardContext);
};
