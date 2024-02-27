import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';

function HazardModal() {
  const { skidModalState, setSkidModalState } = useSkidModal();

  const selectedHazard = skidModalState.selectedHazardData;
  const selectedHarms = selectedHazard.harms ? JSON.parse(selectedHazard.harms) : {};

  /**
   * Closes the Hazard Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
  */
  const handleClose = () => {
    setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false }));
  };

  return (
    <Modal show={skidModalState.hazardModalVisible} onHide={handleClose} style={{zindex: 99999}} backdrop="static">
      <Modal.Header style={{ backgroundColor: selectedHazard.color }}>
        <Modal.Title>
          <b>{selectedHazard.id}: <em>{selectedHazard.title}</em></b> <small>({selectedHazard.sev})</small>
        </Modal.Title>
        <div style={{ float: 'right' }}>
          <b>{selectedHazard.cat}</b>
        </div>
      </Modal.Header>
      <Modal.Body>
        <dl>
          {Object.entries(selectedHarms).map(([key, value]) => (
            <React.Fragment key={key}>
              <dt style={{ width: '200px' }}>{key}</dt>
              <dd>
                <ul>
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ float: 'right', marginTop: '10px', marginBottom: '10px' }}>
          <em>Reviewed: {selectedHazard.reviewDate} ({selectedHazard.reviewReason})</em>
        </div>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HazardModal;
