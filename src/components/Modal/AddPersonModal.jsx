import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useSkidModal } from './Skid/SkidModalContext';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';

const AddPersonModal = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { setAlertMessageState } = useAlertMessage();
  const { mapState, setMapState } = useMap();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    crewName: 'Unassigned'
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      crewName: 'Unassigned'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddPersonModalVisible: false
    }));
  };

  const handleSubmit = async (e) => {
    setShowSpinner(true);
    const id = new Date().getTime();

    e.preventDefault();

    /* setAlertMessageState((prevState) => ({
      ...prevState,
      show: true,
      heading: "Add Person",
      message: "Please wait..."
    }))
 */
    try {
      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/createperson', formData, {
        withCredentials: true
      });

      console.log('Error has occured', response.status);

      if (response.status === 200) {
        //window.location.reload();
        handleClose();
        console.log('this is the reposne of adding person: ', response.data.person);

        console.log('this is the crews array: ', mapState.crews);
        setMapState((prevState) => {
          if (!prevState.crews) {
            // If prevState.crews is undefined, initialize it as an empty array
            prevState = { ...prevState, crews: [] };
          }

          const updatedCrews = prevState.crews.map((crew) => {
            if (crew.name === response.data.person.crew) {
              // If the crew name matches, add the person to the people array
              return {
                ...crew,
                people: [...crew.people, response.data.person]
              };
            }
            return crew;
          });

          // If the crew does not exist, add it with the person in the people array
          if (!prevState.crews.some((crew) => crew.name === response.data.person.crew)) {
            updatedCrews.push({
              name: response.data.person.crew,
              people: [response.data.person]
            });
          }

          return {
            ...prevState,
            crews: updatedCrews
          };
        });

        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Add Crew',
              show: true,
              message: `Success! ${formData.firstName} ${formData.lastName} has been added to ${formData.crewName}`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        resetForm();
      } else {
        console.error('Failed to create person');
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Add Person',
            show: true,
            message: `Error! adding ${formData.firstName} ${formData.lastName} to ${formData.crewName}`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Network error:', error);
    } finally {
      setShowSpinner(false);

      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  return (
    <Modal
      centered
      show={skidModalState.isAddPersonModalVisible}
      onHide={handleClose}
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
            <Form.Label htmlFor='crewName'>
              <b>Crew</b>
            </Form.Label>
            <Form.Select
              id="crewName"
              name="crewName"
              style={{ height: '38px' }}
              required
              value={formData.crewName || 'Unassigned'}
              onChange={handleInputChange}
            >
              <option value="Unassigned" disabled>
                Unassigned
              </option>
              {mapState.crews
                .filter((crew) => crew.name !== 'Unassigned')
                .map((crew) => (
                  <option key={crew.name} value={crew.name}>
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

export default AddPersonModal;
