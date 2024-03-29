import { createContext, useContext, useState } from 'react';

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

export const useMap = () => {
  return useContext(MapContext);
};
