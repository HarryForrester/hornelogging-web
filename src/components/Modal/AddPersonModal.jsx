import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
import { usePeople } from '../../context/PeopleContext';
import { useCrews } from '../../context/CrewContext';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const AddPersonModal = ({ show, closeModal }) => {
  const { addToast } = useAlertMessage();
  const { people, setPeople } = usePeople();
  const { crews } = useCrews();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const unassignedCrewId = people.peopleByCrew.find(crew => crew.unassigned === true)._id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    crewId: unassignedCrewId || ''
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      crewId: unassignedCrewId
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('name', name);
    console.log('value', value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setShowSpinner(true);
    const crewName = crews.find(crew => crew._id === formData.crewId).name;

    e.preventDefault();

    try {
      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/createperson', formData, {
        withCredentials: true
      });

      if (response.status === 200) {
  
        closeModal();
        setPeople((prevState) => {
          if (!prevState.peopleByCrew) {
            // If prevState.crews is undefined, initialize it as an empty array
            prevState = { ...prevState, peopleByCrew: [] };
          }

          const updatedPeopleByCrew = prevState.peopleByCrew.map((crew) => {
            if (crew._id === response.data.person.crew) {
              // If the crew name matches, add the person to the people array
              return {
                ...crew,
                people: [...crew.people, response.data.person]
              };
            }
            return crew;
          });

          // If the crew does not exist, add it with the person in the people array
          if (!prevState.peopleByCrew.some((crew) => crew._id === response.data.person.crew)) {
            updatedPeopleByCrew.push({
              name: response.data.person.crew,
              people: [response.data.person]
            });
          }

          return {
            ...prevState,
            peopleByCrew: updatedPeopleByCrew
          };
        });
        const crewName = crews.find(crew => crew._id === formData.crewId).name;
        addToast('Add Crew', `Success! ${formData.firstName} ${formData.lastName} has been added to ${crewName}`, 'success', 'white');

        resetForm();
      } else {
        console.error('Failed to create person');
      }
    } catch (error) {
      console.error('Network error:', error);
      addToast('Add Crew', `Error! ${formData.firstName} ${formData.lastName} could not be added to ${crewName}`, 'danger', 'white');

    } finally {
      setShowSpinner(false);

    }
  };

  return (
    <Modal
      centered
      show={show}
      onHide={closeModal}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Person</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstName">
              <b>First Name</b>
            </Form.Label>
            <Form.Control
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor='lastName'>
              <b>Last Name</b>
            </Form.Label>
            <Form.Control
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor='crewId'>
              <b>Crew</b>
            </Form.Label>
            <Form.Select
              id="crewId"
              name="crewId"
              style={{ height: '38px' }}
              required
              value={formData.crewId}
              onChange={handleInputChange}
            >
              
              {people.peopleByCrew
                .map((crew) => (
                  <option key={crew._id} value={crew._id}>
                    {crew.name}
                  </option>
                ))}
            </Form.Select>
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

AddPersonModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default AddPersonModal;
