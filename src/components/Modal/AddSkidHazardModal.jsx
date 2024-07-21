import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSkidModal } from './Skid/SkidModalContext';
import { useSkid } from '../../context/SkidContext';
import { useMap } from '../Map/MapContext';
const AddSkidHazardModal = (sumbitSkidHazard ) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidState, setSkidState } = useSkid();
  const { mapState, setMapState } = useMap();

  /**
   * Closes the Add Document Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isSelectHazardModalVisible: false,
      isGeneralHazardsModalVisible: true
    }));
  };

  return (
    <Modal show={skidModalState.isSelectHazardModalVisible} centered>
      <Modal.Header>
        <Modal.Title className="fs-5">Add Hazard</Modal.Title>
        <Button variant="link" onClick={handleClose}>
          Close
        </Button>
      </Modal.Header>

      <Modal.Body>
        <Form.Group controlId="search-criteria-hazard">
          <Form.Label>Search:</Form.Label>
          <Form.Control type="text" placeholder="Search" size="30" />
        </Form.Group>
      </Modal.Body>

      <Modal.Body>
        <div className="modal-hazards">
          {mapState.hazards.map((hazard) => (
            <div className="card" style={{ marginBottom: 10 }} key={hazard.id}>
              <div className="search-text" style={{ display: 'none' }}>
                {hazard.searchText}
              </div>
              <div className="card-header" style={{ backgroundColor: hazard.color }}>
                <div style={{ float: 'left' }}>
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        <b>{hazard.id}: </b>
                        <em>{hazard.title}</em>
                      </>
                    }
                    id={`hazard-checkbox-${hazard._id}`}
                  />
                  <small>{hazard.sev}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        <Button variant="secondary" onClick={sumbitSkidHazard}>
          Add Hazard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSkidHazardModal;
