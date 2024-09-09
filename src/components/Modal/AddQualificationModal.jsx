import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
const AddQualificationModal = ({ show, hide, person, setQuals }) => {
  const [title, setTitle] = useState('');
  const { addToast } = useAlertMessage();

  const handleClose = () => {
    setTitle('');
    hide();
  };

  const handleSubmit = async () => {
    const data = {
      title,
      employee: person._id,
      complete: false
    };

    try {
      // eslint-disable-next-line no-undef
      const response = await axios.post(`${process.env.REACT_APP_URL}/add-qualification`, data, {
        withCredentials: true
      });

      if (response.status === 200) {
        console.log('quals are good: ', response.data);
        setQuals(response.data.quals);
        addToast('Qualification Added!', `Success! ${title} has been added to ${person.name} Qualifications`, 'success', 'white');
        handleClose();
      }
    } catch (err) {
      addToast('Error!',`An error has occurred while adding ${title} to ${person.firstName} ${person.lastName}'s qualifications, please try again`, 'danger', 'white');
      console.error('an error has occurred', err);
    }
  };

  const handleTitleChange = (title) => {
    setTitle(title);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
  person: PropTypes.object,
  setQuals: PropTypes.func.isRequired,
};
export default AddQualificationModal;
