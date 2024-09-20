import React, { useState } from 'react';
import { Modal, Button, Accordion } from 'react-bootstrap';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';

/**
 * SelectHazardsModal component allows users to search, filter, and select hazards from a list.
 * It displays hazards grouped by their categories and allows adding them to a selected list.
 * 
 * @component
 * @param {Object} props - React props
 * @param {string} props.title - Title of the modal
 * @param {boolean} props.showModal - Indicates whether the modal is shown or hidden
 * @param {Function} props.handleClose - Function to close the modal
 * @param {Function} props.handleCheckboxChange - Function to handle checkbox changes
 * @param {Array} props.selectedHazards - Array of selected hazard IDs
 * @returns {JSX.Element} The rendered component
 */
const SelectHazardsModal = ({ title, showModal, handleClose, handleCheckboxChange, selectedHazards }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const { mapState } = useMap(); // Access map state from context

  /**
   * Filters hazards based on the search query.
   * @constant {Array} filteredHazards
   */
  const filteredHazards = mapState.hazards.filter((hazard) =>
    hazard.searchText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Groups hazards by their categories.
   * @constant {Object} groupedHazards
   */
  const groupedHazards = filteredHazards.reduce((acc, hazard) => {
    if (!acc[hazard.cat]) {
      acc[hazard.cat] = [];
    }
    acc[hazard.cat].push(hazard);
    return acc;
  }, {});

  return (
    <div data-testid="select-hazards-modal">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton closeLabel="Close">
          <Modal.Title>{title}</Modal.Title>
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
                  // Filters hazards that are not selected
                  const hazardsToShow = groupedHazards[cat].filter(
                    (hazard) =>
                      Array.isArray(selectedHazards) && !selectedHazards.some(
                        (selectedHazard) => selectedHazard === hazard._id
                      )
                  );
                  console.log("HAZARDS TO SHOW!!!", hazardsToShow)

                  // Skip rendering empty categories
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
      </Modal>
    </div>
  );
};

// Prop type validation for the component's props
SelectHazardsModal.propTypes = {
  title: PropTypes.string.isRequired, // title must be a string and is required
  showModal: PropTypes.bool.isRequired, // showModal must be a boolean and is required
  handleClose: PropTypes.func.isRequired, // handleClose must be a function and is required
  handleCheckboxChange: PropTypes.func.isRequired, // handleCheckboxChange must be a function and is required
  selectedHazards: PropTypes.array.isRequired // selectedHazards must be an array and is required
}

export default SelectHazardsModal;