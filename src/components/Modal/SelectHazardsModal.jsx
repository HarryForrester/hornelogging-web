import React, { useState, useEffect } from 'react';
import {Modal, Button, Accordion} from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { faZ } from '@fortawesome/free-solid-svg-icons';
import { joinPaths } from '@remix-run/router';
import { useSkid } from '../../context/SkidContext';
const SelectHazardsModal = ({ submitSelectedHazards }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHazards, setSelectedHazards] = useState([]);
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidState, setSkidState } = useSkid();
  const { mapState, setMapState } = useMap();

  const submitHazards = (selectedHazards) => {
    if (selectedHazards.length > 0) {
      submitSelectedHazards(selectedHazards);
      setSelectedHazards([]);
      setSearchQuery('');
  
    }
  };

  /**
   * Closes the Add Site Hazard Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    if (skidModalState.isSelectHazardsGeneral) {
      setSkidState((prevState) => ({
        ...prevState,
        selectHazardModalVisible: false,
        generalHazardsModalVisible: true
      }));
    } else {
      setSkidState((prevState) => ({
        ...prevState,
        selectHazardModalVisible: false,
        skidModalVisible: true
      }));
    }
  };

  /* const handleSearchChange = (event) => {
    setSearchCriteria(event.target.value);
  }; */

  const handleCheckboxChange = (hazard) => {
    const hazardId = hazard._id
    const { formik } = skidState;

    console.log("handleCheckboxChange: ", hazardId);
  
    const updatedHazards = skidState.formik.values.selectedSkidHazards.includes(hazardId)
    ? skidState.formik.values.selectedSkidHazards.filter((id) => id !== hazardId)
    : [...skidState.formik.values.selectedSkidHazards, hazardId];

    setSkidModalState((prevState) => ({
      ...prevState,
      selectedSkidHazards: updatedHazards
    }));
    setSkidState((prevState) => {
     
      console.log('hey u cunt', updatedHazards)
      return {
        ...prevState,
        formik: {
          ...prevState.formik,
          values: {
            ...prevState.formik.values,
            selectedSkidHazards: updatedHazards
          },
          // Update touched or errors if needed
        }
      };
    });
  };


  
  var label;

  if (skidModalState.isSelectHazardsGeneral) {
    label = 'General';
  } else {
    label = 'Skid';
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <br />
          <div className="modal-hazards">
            <Accordion>
              {Object.keys(groupedHazards).map((cat, index) => {
                const hazardsToShow = groupedHazards[cat].filter(
                  (hazard) => 
                      skidState.formik &&
                    skidState.formik.values &&
                    !skidState.formik.values.selectedSkidHazards.some(
                      (selectedHazard) => selectedHazard == hazard._id
                    )
                );

                return (
                  <Accordion.Item eventKey={index.toString()} key={cat}>
                    <Accordion.Header>{cat}</Accordion.Header>
                    <Accordion.Body>
                      {hazardsToShow.map((hazard) => (
                        <div className="card" style={{ marginBottom: '10px' }} key={hazard._id}>
                        <div className="search-text" style={{ display: 'none' }}>
                          {hazard.searchText}
                        </div>
                        <div className="card-header" style={{ backgroundColor: hazard.color }}>
                        <div style={{ float: 'left' }}>
                            <b>{hazard.cat}</b>
                          </div>
                          <div style={{ float: 'right' }}>
                            {/* <input
                              type="checkbox"
                              name="selectedHazards[]"
                              value={hazard._id}
                              onChange={() => handleCheckboxChange(hazard._id)}
                              checked={skidState.formik?.values?.selectedSkidHazards?.includes(hazard._id)}
                            /> */}
                           
                            <b>
                              {hazard.id}: <em>{hazard.title}</em>
                            </b>
                            &nbsp;&nbsp;
                            <small>({hazard.sev})</small>
                            <Button
                              type="button"
                              onClick={() => handleCheckboxChange(hazard)}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>
                          
                        </div>
                      </div>

                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })}

            </Accordion>
            {/* {mapState.hazards.map((hazard) => (
              <div className="card" style={{ marginBottom: '10px' }} key={hazard._id}>
                <div className="search-text" style={{ display: 'none' }}>
                  {hazard.searchText}
                </div>
                <div className="card-header" style={{ backgroundColor: hazard.color }}>
                <div style={{ float: 'left' }}>
                    <b>{hazard.cat}</b>
                  </div>
                  <div style={{ float: 'right' }}>
                    {/* <input
                      type="checkbox"
                      name="selectedHazards[]"
                      value={hazard._id}
                      onChange={() => handleCheckboxChange(hazard._id)}
                      checked={skidState.formik?.values?.selectedSkidHazards?.includes(hazard._id)}
                    /> 
                   
                    <b>
                      {hazard.id}: <em>{hazard.title}</em>
                    </b>
                    &nbsp;&nbsp;
                    <small>({hazard.sev})</small>
                    <Button
                      type="button"
                      onClick={() => handleCheckboxChange(hazard)}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  
                </div>
              </div>
            ))} */}
          </div>
        </>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SelectHazardsModal.propTypes = {
  submitSelectedHazards: PropTypes.func.isRequired
};

export default SelectHazardsModal;
