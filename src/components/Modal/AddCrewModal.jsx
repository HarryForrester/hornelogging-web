import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { useCrews } from '../../context/CrewContext';
import { usePeople } from '../../context/PeopleContext';
import PropTypes from 'prop-types';
const AddCrewModal = ({ show, closeModal }) => {
  const { addToast } = useAlertMessage();
  const { crews } = useCrews();
  const { setPeople } = usePeople();
  const [showSpinner, setShowSpinner] = useState(false);
  const [crew, setCrew] = useState('');

  const handleInputChange = (e) => {
    setCrew(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    try {
      const doesCrewExist = crews.some((c) => c.name === crew);
      //If crew already exists then show alert to tell user it already exists
      if (doesCrewExist) {
        addToast('Add Crew', `Crew named "${crew}" already exists. Please try another crew name`, 'danger', 'white');
      } // if crew does not exist then add the send crew to server.
      else {
        const response = await axios.post(
          // eslint-disable-next-line no-undef
          process.env.REACT_APP_URL + '/createcrew', { name: crew }, { withCredentials: true }
        );

        if (response.status === 200) {
          closeModal();
          setPeople((prevState) => ({
            ...prevState,
            peopleByCrew: response.data.crews,
            archivedPeople: response.data.archivedPeople
          }));
          
          addToast('Add Crew', `Success! "${crew}" has been added`, 'success', 'white');
          setCrew(null);
        }
      }
    } catch (error) {
      addToast('Add Crew', `Error! An Error occurred while adding "${crew}"`, 'danger', 'white');
      console.error('Error submitting form:', error);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Crew</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name" className="form-label">
              <b>Crew Name</b>
            </Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="name"
              name="name"
              required
              value={crew}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleSubmit}>
          {showSpinner ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            'Add'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddCrewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default AddCrewModal;
