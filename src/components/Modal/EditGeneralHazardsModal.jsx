import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSkid } from '../../context/SkidContext';

const EditGeneralHazardModal = ({ submitGeneralHazardModal, handleClose }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { setSkidState } = useSkid();

  /**
   * Opens the SelectHazardsModal and hides the Edit General Hazards Modal.
   * @function openSelectHazardModal
   * @returns {void}
   */
  const openSelectHazardModal = () => {
    setSkidState((prevState) => ({
      ...prevState,
      selectHazardModalVisible: true
    }));
  };

  const handleHazardClick = (hazard) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      selectedHazardData: hazard
    }));
  };

  /**
   * Handles the removal of a general hazard from the general hazards list.
   * @param {*} event - event of the button click
   * @param {*} hazardToRemove - the hazard object to be removed
   */
  const removeSkidHazard = (event, hazardToRemove) => {
    event.stopPropagation();

    setMapState((prevState) => {
      const updatedHazards = prevState.selectedGeneralHazards.filter(
        (hazard) => hazard !== hazardToRemove._id
      );
      return {
        ...prevState,
        selectedGeneralHazards: updatedHazards
      };
    });
  };

  // Ensure that selectedGeneralHazards is always an array
  const selectedGeneralHazards = Array.isArray(mapState.selectedGeneralHazards) 
    ? mapState.selectedGeneralHazards 
    : [];

  return (
    <div data-testid="edit-general-hazards-modal">
      <Modal
        show={skidModalState.isGeneralHazardsModalVisible}
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
                {selectedGeneralHazards
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

EditGeneralHazardModal.propTypes = {
  submitGeneralHazardModal: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default EditGeneralHazardModal;
