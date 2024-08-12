import React, { useState } from 'react';
import { Modal, Button, Accordion } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { useSkid } from '../../context/SkidContext';

const SelectHazardsModal = ({ submitSelectedHazards }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidState, setSkidState } = useSkid();
  const { mapState, setMapState } = useMap();

  const handleClose = () => {
    if (skidModalState.isSelectHazardsGeneral) {
      setSkidState((prevState) => ({
        ...prevState,
        selectHazardModalVisible: false,
        generalHazardsModalVisible: true,
      }));
    } else {
      setSkidState((prevState) => ({
        ...prevState,
        selectHazardModalVisible: false,
        skidModalVisible: true,
      }));
    }
  };

  const handleCheckboxChange = (hazard) => {
    const hazardId = hazard._id;

    //If in selecting General Hazards mode
    if (skidModalState.isSelectHazardsGeneral) {
      const selectedGeneralHazards = Array.isArray(mapState.selectedGeneralHazards)
        ? mapState.selectedGeneralHazards
        : [];

      const updatedHazards = selectedGeneralHazards.includes(hazardId)
        ? selectedGeneralHazards.filter((id) => id !== hazardId)
        : [...selectedGeneralHazards, hazardId];

      setMapState((prevState) => ({
        ...prevState,
        selectedGeneralHazards: updatedHazards,
      }));
    } else {
      //selecting skid (site) hazards
      const selectedSkidHazards = skidState.formik?.values?.selectedSkidHazards || [];
      const updatedHazards = selectedSkidHazards.includes(hazardId)
        ? selectedSkidHazards.filter((id) => id !== hazardId)
        : [...selectedSkidHazards, hazardId];

      setSkidState((prevState) => ({
        ...prevState,
        formik: {
          ...prevState.formik,
          values: {
            ...prevState.formik?.values,
            selectedSkidHazards: updatedHazards,
          },
        },
      }));
    }
  };

  const label = skidModalState.isSelectHazardsGeneral ? 'General' : 'Skid';

  const selectedHazardsField = skidModalState.isSelectHazardsGeneral
    ? mapState.selectedGeneralHazards || []
    : skidState.formik?.values?.selectedSkidHazards || [];

  const filteredHazards = mapState.hazards.filter((hazard) =>
    hazard.searchText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHazards = filteredHazards.reduce((acc, hazard) => {
    if (!acc[hazard.cat]) {
      acc[hazard.cat] = [];
    }
    acc[hazard.cat].push(hazard);
    return acc;
  }, {});

  return (
    <Modal show={skidState.selectHazardModalVisible} onHide={handleClose}>
      <Modal.Header closeButton closeLabel="Close">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-input"
          />
          <br />
          <div className="modal-hazards">
            <Accordion defaultActiveKey="0">
              {Object.keys(groupedHazards).map((cat, index) => {
                const hazardsToShow = groupedHazards[cat].filter(
                  (hazard) =>
                    Array.isArray(selectedHazardsField) && !selectedHazardsField.some(
                      (selectedHazard) => selectedHazard === hazard._id
                    )
                );

                if (hazardsToShow.length === 0) {
                  return null;
                }

                return (
                  <Accordion.Item eventKey={index.toString()} key={cat} data-testid={`accordion-item-${index}`}>
                    <Accordion.Header data-testid={`accordion-header-${index}`}>{cat}</Accordion.Header>
                    <Accordion.Body data-testid={`accordion-body-${index}`}>
                      {hazardsToShow.map((hazard) => (
                        <div className="card" style={{ marginBottom: '10px' }} key={hazard._id}>
                          <div className="search-text" style={{ display: 'none' }}>
                            {hazard.searchText}
                          </div>
                          <div className="card-header" style={{ backgroundColor: hazard.color }}>
                            <div style={{ float: 'left' }}>
                              <b>
                                {hazard.id}: <em>{hazard.title}</em>
                              </b>
                              &nbsp;&nbsp;
                              <small>({hazard.sev})</small>
                            </div>
                            <div style={{ float: 'right' }}>
                              <Button
                                type="button"
                                onClick={() => handleCheckboxChange(hazard)}
                                size="sm"
                                data-testid={`addHazard-${hazard._id}`}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        </>
      </Modal.Body>

      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

SelectHazardsModal.propTypes = {
  submitSelectedHazards: PropTypes.func.isRequired,
};

export default SelectHazardsModal;
