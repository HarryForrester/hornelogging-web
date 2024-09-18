import React from 'react';
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a new context for the Skid state
const SkidContext = createContext();

/**
 * SkidProvider component that wraps its children with SkidContext.Provider.
 * This provides access to the skidState and setSkidState across the component tree.
 *
 * @param {object} props - The component's children.
 * @returns {JSX.Element} A provider wrapping the children with skid context.
 */
export const SkidProvider = ({ children }) => {
  // Initialize the state to hold various modal visibility and skid-related data
  const [skidState, setSkidState] = useState({
    selectedSkidId: null, // ID of the selected skid
    selectedSkidPos: null, // Position of the selected skid
    formik: null, // Formik form object, potentially shared across modals
    //skidModalVisible: false, // Visibility state of the skid modal
    //docModalVisible: false, // Visibility state of the document modal
    //cutPlanModalVisible: false, // Visibility state of the cut plan modal
    //selectHazardModalVisible: false // Visibility state of the hazard selection modal
  });

  // The context provider component supplies skidState and its setter to any descendants
  return (
    <SkidContext.Provider value={{ skidState, setSkidState }}>{children}</SkidContext.Provider>
  );
};

// Type-checking for SkidProvider props to ensure 'children' is passed correctly
SkidProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired
};

/**
 * Custom hook to access the SkidContext and retrieve the current state and the function
 * to update the state.
 *
 * @returns {object} Contains skidState and setSkidState from SkidContext.
 */
export const useSkid = () => {
  return useContext(SkidContext); // Accesses and returns the value from SkidContext
};
