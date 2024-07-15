import React from 'react';
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SkidContext = createContext();

export const SkidProvider = ({ children }) => {
  const [skidState, setSkidState] = useState({
   formik: null,
   skidModalVisible: false,
   docModalVisible: false,
   cutPlanModalVisible: false,
   selectHazardModalVisible: false,
   
  });

  return (
    <SkidContext.Provider value={{ skidState, setSkidState }}>
      {children}
    </SkidContext.Provider>
  );
};

SkidProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useSkid = () => {
  return useContext(SkidContext);
};
