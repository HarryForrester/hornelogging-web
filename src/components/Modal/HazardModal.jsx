import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import tinycolor from 'tinycolor2';
import PropTypes from 'prop-types';

function HazardModal({ selectedHazard }) {
  const { skidModalState, setSkidModalState } = useSkidModal();

  const selectedHarms = selectedHazard.harms ? JSON.parse(selectedHazard.harms) : {};

  /**
   * Closes the Hazard Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    if(skidModalState.isSelectHazardsGeneral) {
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false, isGeneralHazardsModalVisible: true}));
    } else if (skidModalState.isSkidModalEdit || skidModalState.isSkidModalAdd) {
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false, isSkidModalVisible: true}));
    } else {
      setSkidModalState((prevState) => ({ ...prevState, hazardModalVisible: false}));
    }
  };
  const lighterBackgroundColor = tinycolor(selectedHazard.color).lighten(30).toString()

  return (
    <div data-testid="hazard-modal">
      <Modal
      show={skidModalState.hazardModalVisible}
      onHide={handleClose}
      size='lg'
      contentClassName='hazard-modal-content'
      className='hazard-modal'
      style={{padding: 0, margin: 0 }}
      >
        <Modal.Header style={{ backgroundColor: selectedHazard.color }} data-testid='hazard-header' closeButton>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Modal.Title>
              <b>
                {selectedHazard.id}: <em>{selectedHazard.title}</em>
              </b>{' '}
              <small>({selectedHazard.sev})</small>
            </Modal.Title>
            <div>
              <b>{selectedHazard.cat}</b>
            </div>
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

HazardModal.propTypes = {
  selectedHazard: PropTypes.object.isRequired
}

export default HazardModal;
