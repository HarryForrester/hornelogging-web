import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapState, setMapState] = useState({
    currentMapId: null,
    currentMapName: null,
    originalWidth: null,
    originalHeight: null,
    currentMapMarkers: [],
    currentMapUrl: null,
    enableMarker: false,
    files: [],
    crews: [],
    archivedPeople: [],
    crewTypes: [],
    maps: [],
    username: null,
    hazards: [],
    generalHazards: [],
    generalHazardsData: [],
    confirmModalLabel: null,
    confirmModalMessage: null
  });

  return <MapContext.Provider value={{ mapState, setMapState }}>{children}</MapContext.Provider>;
};

MapProvider.propTypes = {
  children: PropTypes.object.isRequired,
}

export const useMap = () => {
  return useContext(MapContext);
};
