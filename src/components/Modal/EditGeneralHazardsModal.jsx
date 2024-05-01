import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { Anchor, ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

const EditGeneralHazardModal = ({ submitGeneralHazardModal, handleClose }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();

  /**
   * Opens the Add Site Hazard Modal and hides the Edit General Hazards Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openSelectHazardModal = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isSelectHazardModalVisible: true,
      isGeneralHazardsModalVisible: false
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
    console.log('removing general hazard', hazardToRemove);
    event.stopPropagation();

    setMapState((prevState) => {
      const updatedHazards = prevState.generalHazardsData.filter(
        (hazard) => hazard.id !== hazardToRemove
      );
      return {
        ...prevState,
        generalHazardsData: updatedHazards
      };
    });
  };

  const test = mapState.generalHazardsData;
  return (
    <>
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
                {mapState.generalHazardsData.map((hazard) => (
                  <ListGroupItem
                    key={hazard.id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center' }}
                    onClick={() => handleHazardClick(hazard)}
                  >
                    <span>
                      {hazard.id} : {hazard.title}
                    </span>
                    <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={(event) => removeSkidHazard(event, hazard.id)}
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
    </>
  );
};

EditGeneralHazardModal.propTypes = {
  submitGeneralHazardModal: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
}
export default EditGeneralHazardModal;
