import { createContext, useContext, useState } from "react";

const SkidMarkerContext = createContext();

export const SkidMarkerProvider = ({ children }) => {
    const [skidMarkerState, setSkidMarkerState] = useState({
        popoverVisible: false,
        popoverCrewVisible: false,
        popoverPersonVisible: false,

        selectedMarker: null,
        mousePosition: {x:0, y:0},
        editSkid: false, //stores the mode for editing or adding a skid (fasle = add, true = editing)
        selectedSkidCrew: null,
        selectedMarkerSiteHazards: [],
        peopleByCrew: {}, 
        selectedSkidPersonFiles: [],
        personFiles: [],

    });

    return (
        <SkidMarkerContext.Provider value={{ skidMarkerState, setSkidMarkerState }}>
            {children}
        </SkidMarkerContext.Provider>
    );
};

export const useSkidMarker = () => {
    return useContext(SkidMarkerContext);
}