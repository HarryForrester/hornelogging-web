import React,{ useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSkid } from '../../context/SkidContext';
import SelectHazardsModal from './SelectHazardsModal';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
const EditGeneralHazardModal = ({showModal, setShowModal }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { setSkidState } = useSkid()
  const { addToast } = useAlertMessage();
  const [selectHazardsModalVisible, setSelectHazardsModalVisible] = useState(false);

  const [selectedHazards, setSelectedHazards] = useState([]);

  useEffect(() => {
    if (showModal) {
      // Set selectedHazards only when the modal opens, not when generalHazards changes.
      setSelectedHazards((prevSelectedHazards) => {
        const initialHazards = Array.isArray(mapState.generalHazards) ? mapState.generalHazards : [];
        return prevSelectedHazards.length === 0 ? initialHazards : prevSelectedHazards;
      });
    }
  }, [showModal]); // Only run when showModal changes

  const handleClose = () => {
    setShowModal(false);
    setSelectedHazards([]);
  }

  const submitGeneralHazardModal = async () => {
    //const id = new Date().getTime();
    
    try {
      const resp = await axios.post(
        'http://localhost:3001/submitGeneralHazards',
        selectedHazards,
        { withCredentials: true }
      );
      if (resp.status === 200) {
        setMapState((prevState) => ({
          ...prevState,
          generalHazards: selectedHazards
        })); 
        //setSelectedGeneralHazards(selectedGeneralHazards);
        setShowModal(false);
        //setSkidModalState((prevState) => ({ ...prevState, isGeneralHazardsModalVisible: false }));
        addToast('General Hazards Updated!', `Success! General hazards have been updated.`, 'success', 'white');
      }
    } catch (error) {
      addToast('Error!', `An error has occurred while updating general hazards. Please try again later.`, 'danger', 'white');
      console.error('An error hsa occcured while updating general hazards: ', error);
    }
  };
  

  /**
   * Opens the SelectHazardsModal and hides the Edit General Hazards Modal.
   * @function openSelectHazardModal
   * @returns {void}
   */
  const openSelectHazardModal = () => {
    /* setSkidState((prevState) => ({
      ...prevState,
      selectHazardModalVisible: true
    })); */
    setSelectHazardsModalVisible(true);
    setShowModal(false);
  };

  const handleHazardClick = (hazard) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      selectedHazardData: hazard
    }));
  };

  /**
   * Handles the removal of a general hazard from the general hazards list.
   * @param {*} event - event of the button click
   * @param {*} hazardToRemove - the hazard object to be removed
   */
  const removeSkidHazard = (event, hazardToRemove) => {
    event.stopPropagation();

   /*  setMapState((prevState) => {
      const updatedHazards = prevState.selectedGeneralHazards.filter(
        (hazard) => hazard !== hazardToRemove._id
      );
      return {
        ...prevState,
        selectedGeneralHazards: updatedHazards
      };
    }); */
    const updatedHazards = selectedHazards.filter(
      (hazard) => hazard !== hazardToRemove._id
    );
    setSelectedHazards(updatedHazards);

  };

  // Ensure that selectedGeneralHazards is always an array
 /*  const selectedGeneralHazards = Array.isArray(mapState.selectedGeneralHazards) 
    ? mapState.selectedGeneralHazards 
    : []; */

    const handleSelectHazardModalClose = () => { 
      setSelectHazardsModalVisible(false);
      setShowModal(true);
    }

    const handleCheckboxChange = (hazard) => {
      const hazardId = hazard._id;
    
      setSelectedHazards((prevSelectedHazards) => {
        const updatedHazards = prevSelectedHazards.includes(hazardId)
          ? prevSelectedHazards.filter((id) => id !== hazardId)
          : [...prevSelectedHazards, hazardId];
        
        console.log('Previous Selected Hazards:', prevSelectedHazards);
        console.log('Updated Hazards:', updatedHazards);
        
        return updatedHazards;
      });
    };
  return (
    <div data-testid="edit-general-hazards-modal">
      <SelectHazardsModal title="Select General Hazards" showModal={selectHazardsModalVisible} handleClose={handleSelectHazardModalClose} handleCheckboxChange={handleCheckboxChange} selectedHazards={selectedHazards} />
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit General Hazards</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="addGeneralHazardForm" className="row g-3">
            <Form.Group className="col-md-12">
              <Form.Group className="input-group">
                <Button
                  type="button"
                  id="siteDocs"
                  className="btn btn-secondary btn-block"
                  onClick={openSelectHazardModal}
                >
                  Add Hazard
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedHazards
                  .map(id => mapState.hazards.find(hazard => hazard._id === id))
                  .filter(hazard => hazard)
                  .map(hazard => (
                    <ListGroupItem
                      key={hazard._id}
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action skid-hazard-item border border-secondary"
                      style={{ textAlign: 'center', backgroundColor: hazard.color, cursor: 'pointer' }}
                      onClick={() => handleHazardClick(hazard)}
                    >
                      <span>
                        {hazard.id} : {hazard.title}
                      </span>
                      <Button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={(event) => removeSkidHazard(event, hazard)}
                      >
                        Remove
                      </Button>
                    </ListGroupItem>
                  ))}
              </ListGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitGeneralHazardModal}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

EditGeneralHazardModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default EditGeneralHazardModal;
