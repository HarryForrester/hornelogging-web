import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { usePersonData } from '../PersonData';
import { useAlertMessage } from '../AlertMessage';
const AddQualificationModal = ({ show, hide, person }) => {
  const [title, setTitle] = useState('');

  const { personDataState, setPersonDataState } = usePersonData();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const handleClose = () => {
    setTitle('');
    hide();
  };

  const handleSubmit = async () => {
    console.log('summmy');
    const id = new Date().getTime(); // creates id for alert messages

    const data = {
      title,
      employee: personDataState.person._id,
      complete: false
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/add-qualification`, data, {
        withCredentials: true
      });

      if (response.status === 200) {
        console.log('quals are good: ', response.data);
        setPersonDataState((prevState) => ({
          ...prevState,
          quals: response.data.quals
        }));

        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Qualification Added',
              show: true,
              message: `Success! ${title} has been added to ${personDataState.person.name} Qualifications`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        handleClose();
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: Could not add qualification',
            show: true,
            message: `Error has occurred while adding ${title} to ${personDataState.person.name} qualifications, please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('an error has occurred', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleTitleChange = (title) => {
    setTitle(title);
  };

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>Add Qualification</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              placeholder={'Qualification Title'}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};
AddQualificationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired
};
export default AddQualificationModal;
