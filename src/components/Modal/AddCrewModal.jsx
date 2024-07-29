import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';

const AddCrewModal = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { setAlertMessageState } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false);
  const [crew, setCrew] = useState('');

  const handleInputChange = (e) => {
    setCrew(e.target.value);
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddCrewModalVisible: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const id = new Date().getTime();
    try {
      const doesCrewExist = mapState.crews.some((c) => c.name === crew);
      //If crew already exists then show alert to tell user it already exists
      if (doesCrewExist) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Add Crew',
              show: true,
              message: 'Crew already exists. Please try another crew name',
              background: 'danger',
              color: 'white'
            }
          ]
        }));
      } // if crew does not exist then add the send crew to server.
      else {
        const response = await axios.post(
          // eslint-disable-next-line no-undef
          process.env.REACT_APP_URL + '/createcrew',
          {
            name: crew
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          handleClose();
          setMapState((prevState) => ({
            ...prevState,
            crews: response.data.crews,
            archivedPeople: response.data.archivedPeople
          }));
          
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Add Person',
                show: true,
                message: `Success! ${crew} has been added`,
                background: 'success',
                color: 'white'
              }
            ]
          }));
          setCrew(null);
        }
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Add Crew',
            show: true,
            message: `Error! An Error has occurred adding crew`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error submitting form:', error);
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
    <Modal show={skidModalState.isAddCrewModalVisible} onHide={handleClose} centered>
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

export default AddCrewModal;
