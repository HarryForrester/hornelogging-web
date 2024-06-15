import React from 'react';
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SkidModalContext = createContext();

export const SkidModalProvider = ({ children }) => {
  const [skidModalState, setSkidModalState] = useState({
    _id: null,
    isSkidModalVisible: false,
    isAddDocModalVisible: false,
    isAddCutPlanModalVisible: false,
    isSelectHazardModalVisible: false,
    isGeneralHazardsModalVisible: false,
    isUploadMapModalVisible: false,
    hazardModalVisible: false,
    isSkidModalEdit: false, // if true it will display Edit Skid Modal, if false will dispay Add Skid Modal for component AddOrEditSkidModal.jsx
    isSelectHazardsGeneral: false, // If true SelectHazardsModal will be a Select (General) Hazards else will be a Select (Skid) Hazards
    isConfirmModalVisible: false,
    isAddPersonModalVisible: false,
    isEditPersonModalVisible: false,
    isAddCrewModalVisible: false,
    selectedDocuments: [],
    selectedCutPlan: [],
    skidName: '',
    selectedCrew: [],
    selectedSkidHazards: [],
    selectedSkidHazardsData: [],
    selectedHazardData: {}
  });

  return (
    <SkidModalContext.Provider value={{ skidModalState, setSkidModalState }}>
      {children}
    </SkidModalContext.Provider>
  );
};

SkidModalProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useSkidModal = () => {
  return useContext(SkidModalContext);
};
