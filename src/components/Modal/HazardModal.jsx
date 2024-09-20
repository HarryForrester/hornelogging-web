import React from 'react';
import { Modal } from 'react-bootstrap';
import tinycolor from 'tinycolor2';
import PropTypes from 'prop-types';

/**
 * HazardModal component displays detailed information about a selected hazard.
 * It allows users to review hazards and navigate back to related modals.
 * 
 * @component
 * @param {Object} props - React props
 * @param {boolean} props.showModal - Flag to control the visiblity of HazardModal
 * @param {function} props.handleClose - Function to handle the close operation of HazardModal
 * @param {Object} props.selectedHazard - The selected hazard object
 * @returns {JSX.Element} The rendered component
 */
function HazardModal({ showModal, handleClose, selectedHazard }) {

  // Parse the harms associated with the selected hazard
  const selectedHarms = selectedHazard.harms ? JSON.parse(selectedHazard.harms) : {};

  // Lightens the background color of the modal based on the selected hazard's color
  const lighterBackgroundColor = tinycolor(selectedHazard.color).lighten(30).toString();

  return (
    <div data-testid="hazard-modal">
      <Modal
        show={showModal}
        onHide={handleClose}
        size='lg'
        contentClassName='hazard-modal-content'
        className='hazard-modal'
        style={{ padding: 0, margin: 0 }}
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

// Prop type validation for the component's props
HazardModal.propTypes = {
  showModal: PropTypes.bool.isRequired, // showModal must be an boolean and is required
  handleClose: PropTypes.func.isRequired, // handleClose must be a function and is required
  selectedHazard: PropTypes.object.isRequired // selectedHazard must be an object and is required
}

export default HazardModal;