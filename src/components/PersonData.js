import { createContext, useContext, useState } from "react";

const PersonDataContext = createContext();

export const PersonDataProvider = ({ children }) => {
    const [personDataState, setPersonDataState] = useState({
        person: [],
        files: [],
        fileTypes: [],
        crewTypes: [],
        timesheetAccess: [],
        forms: [],
    });

    return (
        <PersonDataContext.Provider value={{ personDataState, setPersonDataState }}>
            {children}
        </PersonDataContext.Provider>
    );
};

export const usePersonData = () => {
    return useContext(PersonDataContext);
}

