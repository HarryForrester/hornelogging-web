import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { faZ } from '@fortawesome/free-solid-svg-icons';

const SelectHazardsModal = ({ hazards, submitSelectedHazards }) => {
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedHazards, setSelectedHazards] = useState([]);
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();

  const submitHazards = (selectedHazards) => {
    submitSelectedHazards(selectedHazards);
    setSelectedHazards([]);
    setSearchCriteria('');
  };

  /**
   * Closes the Add Site Hazard Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    if (skidModalState.isSelectHazardsGeneral) {
      setSkidModalState((prevState) => ({
        ...prevState,
        isSelectHazardModalVisible: false,
        isGeneralHazardsModalVisible: true
      }));
    } else {
      setSkidModalState((prevState) => ({
        ...prevState,
        isSelectHazardModalVisible: false,
        isSkidModalVisible: true
      }));
    }
  };

  const handleSearchChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleCheckboxChange = (hazardId) => {
    // Toggle the selection of the hazard with hazardId
    setSelectedHazards((prevSelectedHazards) => {
      if (prevSelectedHazards.includes(hazardId)) {
        return prevSelectedHazards.filter((id) => id !== hazardId);
      } else {
        return [...prevSelectedHazards, hazardId];
      }
    });
  };

  var label;

  if (skidModalState.isSelectHazardsGeneral) {
    label = 'General';
  } else {
    label = 'Skid';
  }

  return (
    <Modal show={skidModalState.isSelectHazardModalVisible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select {label} Hazards</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <label htmlFor="search-criteria-hazard">Search:</label>
          <input
            type="text"
            className="form-control"
            size="30"
            placeholder="Search"
            id="search-criteria-hazard"
            value={searchCriteria}
            onChange={handleSearchChange}
          />
          <br />
          <div className="modal-hazards">
            {mapState.hazards.map((hazard) => (
              <div className="card" style={{ marginBottom: '10px' }} key={hazard.id}>
                <div className="search-text" style={{ display: 'none' }}>
                  {hazard.searchText}
                </div>
                <div className="card-header" style={{ backgroundColor: hazard.color }}>
                  <div style={{ float: 'left' }}>
                    <input
                      type="checkbox"
                      name="selectedHazards[]"
                      value={hazard.id}
                      onChange={() => handleCheckboxChange(hazard.id)}
                      checked={selectedHazards.includes(hazard.id)}
                    />
                    <b>
                      {hazard.id}: <em>{hazard.title}</em>
                    </b>
                    &nbsp;&nbsp;
                    <small>({hazard.sev})</small>
                  </div>
                  <div style={{ float: 'right' }}>
                    <b>{hazard.cat}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => submitHazards(selectedHazards)}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SelectHazardsModal.propTypes = {
  hazards: PropTypes.array.isRequired,
  submitSelectedHazards: PropTypes.func.isRequired, 
}

export default SelectHazardsModal;
