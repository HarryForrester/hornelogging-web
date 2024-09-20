import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useMap } from '../Map/MapContext';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SelectHazardsModal from './SelectHazardsModal';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
import HazardModal from './HazardModal';
/**
 * Component for editing general hazards associated with a map.
 * It allows users to add, remove, and modify hazards in a list.
 * 
 * @component
 * @param {Object} props - React props
 * @param {boolean} props.showModal - Indicates whether the modal is shown or hidden
 * @param {Function} props.setShowModal - Function to update the showModal state
 * @returns {JSX.Element} The rendered component
 */
const EditGeneralHazardModal = ({ showModal, setShowModal }) => {
  const { mapState, setMapState } = useMap(); // Function to access and update map state
  const { addToast } = useAlertMessage(); // Function to show toast notifications

  const [selectHazardsModalVisible, setSelectHazardsModalVisible] = useState(false); // State for controlling the SelectHazardsModal visibility
  const [selectedHazards, setSelectedHazards] = useState([]); // State for tracking selected hazards

  const [hazardModalVisible, setHazardModalVisible] = useState(false); // State for controlling the HazardModal visibility
  const [selectedHazard, setSelectedHazard] = useState({}); // State for tracking the selected hazazard to be viewed in detail

  /**
   * Effect to initialize selected hazards when the modal is shown.
   * Sets selectedHazards to mapState.generalHazards when showModal becomes true.
   */
  useEffect(() => {
    if (showModal) {
      setSelectedHazards((prevSelectedHazards) => {
        const initialHazards = Array.isArray(mapState.generalHazards) ? mapState.generalHazards : [];
        return prevSelectedHazards.length === 0 ? initialHazards : prevSelectedHazards;
      });
    }
  }, [showModal]); // Effect runs only when showModal changes

  /**
   * Handles closing of the modal and resets selected hazards.
   * @function handleClose
   */
  const handleClose = () => {
    setShowModal(false); // Hide the modal
    setSelectedHazards([]); // Clear the selected hazards
  }

  /**
   * Submits the updated general hazards to the server and updates map state.
   * @async
   * @function submitGeneralHazardModal
   */
  const submitGeneralHazardModal = async () => {
    try {
      const resp = await axios.post(
        'http://localhost:3001/submitGeneralHazards', // API endpoint for submitting hazards
        selectedHazards, // Selected hazards data
        { withCredentials: true } // Send cookies with the request
      );
      if (resp.status === 200) {
        setMapState((prevState) => ({
          ...prevState,
          generalHazards: selectedHazards
        })); // Update map state with new hazards
        setShowModal(false); // Hide the modal
        addToast('General Hazards Updated!', `Success! General hazards have been updated.`, 'success', 'white'); // Show success toast
      }
    } catch (error) {
      addToast('Error!', `An error has occurred while updating general hazards. Please try again later.`, 'danger', 'white'); // Show error toast
      console.error('An error has occurred while updating general hazards: ', error);
    }
  };

  /**
   * Opens the SelectHazardsModal and hides the current modal.
   * @function openSelectHazardModal
   */
  const openSelectHazardModal = () => {
    setSelectHazardsModalVisible(true); // Show SelectHazardsModal
    setShowModal(false); // Hide current modal
  };

  /**
   * Handles click events on a hazard item, opening the SkidModal with selected hazard data.
   * @param {Object} hazard - The hazard object that was clicked.
   * @function handleHazardClick
   */
  const handleHazardClick = (hazard) => {
    setHazardModalVisible(true);
    setSelectedHazard(hazard);
  };

  /**
   * Removes a hazard from the selected hazards list.
   * @param {Object} event - The event object from the click event.
   * @param {Object} hazardToRemove - The hazard object to be removed.
   * @function removeSkidHazard
   */
  const removeSkidHazard = (event, hazardToRemove) => {
    event.stopPropagation(); // Prevents event from bubbling up
    const updatedHazards = selectedHazards.filter(
      (hazard) => hazard !== hazardToRemove._id
    );
    setSelectedHazards(updatedHazards); // Update the selected hazards list
  };

  /**
   * Closes the SelectHazardsModal and reopens the EditGeneralHazardModal.
   * @function handleSelectHazardModalClose
   */
  const handleSelectHazardModalClose = () => {
    setSelectHazardsModalVisible(false); // Hide SelectHazardsModal
    setShowModal(true); // Show EditGeneralHazardModal
  }

  /**
   * Toggles the selection of a hazard in the selectedHazards state.
   * @param {Object} hazard - The hazard object to toggle.
   * @function handleCheckboxChange
   */
  const handleCheckboxChange = (hazard) => {
    const hazardId = hazard._id;
    setSelectedHazards((prevSelectedHazards) => {
      const updatedHazards = prevSelectedHazards.includes(hazardId)
        ? prevSelectedHazards.filter((id) => id !== hazardId)
        : [...prevSelectedHazards, hazardId];
      return updatedHazards;
    });
  };

  const handleHazardModalClose = () => {
    setHazardModalVisible(false);
    setShowModal(true);
  }

  return (
    <div data-testid="edit-general-hazards-modal">
      <HazardModal showModal={hazardModalVisible} handleClose={handleHazardModalClose} selectedHazard={selectedHazard} />
      <SelectHazardsModal
        title="Select General Hazards"
        showModal={selectHazardsModalVisible}
        handleClose={handleSelectHazardModalClose}
        handleCheckboxChange={handleCheckboxChange}
        selectedHazards={selectedHazards}
      />
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit General Hazards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addGeneralHazardForm" className="row g-3">
            <Form.Group className="col-md-12">
              <Form.Group className="input-group">
                <Button
                  type="button"
                  id="siteDocs"
                  className="btn btn-secondary btn-block"
                  onClick={openSelectHazardModal}
                >
                  Add Hazard
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedHazards
                  .map(id => mapState.hazards.find(hazard => hazard._id === id))
                  .filter(hazard => hazard)
                  .map(hazard => (
                    <ListGroupItem
                      key={hazard._id}
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action skid-hazard-item border border-secondary"
                      style={{ textAlign: 'center', backgroundColor: hazard.color, cursor: 'pointer' }}
                      onClick={() => handleHazardClick(hazard)}
                    >
                      <span>
                        {hazard.id} : {hazard.title}
                      </span>
                      <Button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={(event) => removeSkidHazard(event, hazard)}
                      >
                        Remove
                      </Button>
                    </ListGroupItem>
                  ))}
              </ListGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitGeneralHazardModal}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Prop type validation for the component's props
EditGeneralHazardModal.propTypes = {
  showModal: PropTypes.bool.isRequired, // showModal must be a boolean and is required
  setShowModal: PropTypes.func.isRequired, // setShowModal must be a function and is required
};

export default EditGeneralHazardModal;