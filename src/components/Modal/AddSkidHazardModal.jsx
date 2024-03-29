import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSkidModal } from './Skid/SkidModalContext';

const AddSkidHazardModal = ({ hazards, sumbitSkidHazard }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();

  console.log('hazards: ', hazards);

  /**
   * Closes the Add Document Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddSiteHazardModalVisible: false,
      isSkidModalVisible: true
    }));
  };

  return (
    <Modal show={skidModalState.isAddSiteHazardModalVisible} centered>
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
          {hazards.map((hazard) => (
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
                    id={`hazard-checkbox-${hazard.id}`}
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
