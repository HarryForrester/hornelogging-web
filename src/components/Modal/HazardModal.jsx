import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import tinycolor from 'tinycolor2';
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
    if(skidModalState.isSelectHazardsGeneral) {
      console.log('fk 1')
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false, isGeneralHazardsModalVisible: true}));

    } else if (skidModalState.isSkidModalEdit || skidModalState.isSkidModalAdd) {
      console.log('fk 2')
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false, isSkidModalVisible: true}));

    } else {

      console.log('fk 3')
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false}));

    }
  };
  const lighterBackgroundColor = tinycolor(selectedHazard.color).lighten(30).toString()

  return (
    <Modal
      show={skidModalState.hazardModalVisible}
      onHide={handleClose}
      backdrop="static"
      size='lg'
      contentClassName='hazard-modal-content'
      style={{padding: 0, margin: 0}}
    >
      <Modal.Header style={{ backgroundColor: selectedHazard.color}} closeButton>
        <Modal.Title /* style={{fontSize: 18}} */>
          <b>
            {selectedHazard.id}: <em>{selectedHazard.title}</em>
          </b>{' '}
          <small>({selectedHazard.sev})</small>
        </Modal.Title>
        <div style={{ float: 'right' }}>
          <b>{selectedHazard.cat}</b>
        </div>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: lighterBackgroundColor }}>
        <dl>
          {Object.entries(selectedHarms).map(([key, value]) => (
            <React.Fragment key={key}>
              <dt style={{ width: '150px' }}>{key}</dt>
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
          <em>
            Reviewed: {selectedHazard.reviewDate} ({selectedHazard.reviewReason})
          </em>
        {/* <Button variant="danger" onClick={handleClose}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default HazardModal;
