import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SkidMarkerContext = createContext();

export const SkidMarkerProvider = ({ children }) => {
  const [skidMarkerState, setSkidMarkerState] = useState({
    popoverVisible: false,
    popoverCrewVisible: false,
    popoverPersonVisible: false,

    selectedMarker: null,
    mousePosition: { x: 0, y: 0 },
    editSkid: false, //stores the mode for editing or adding a skid (fasle = add, true = editing)
    selectedSkidCrew: null,
    selectedMarkerSiteHazards: [],
    peopleByCrew: {},
    selectedSkidPersonFiles: [],
    personFiles: []
  });

  return (
    <SkidMarkerContext.Provider value={{ skidMarkerState, setSkidMarkerState }}>
      {children}
    </SkidMarkerContext.Provider>
  );
};

SkidMarkerProvider.propTypes = {
  children: PropTypes.object.isRequired,
}

export const useSkidMarker = () => {
  return useContext(SkidMarkerContext);
};
