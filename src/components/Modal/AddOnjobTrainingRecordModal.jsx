import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const AddOnjobTrainingRecordModal = ({
  showModal,
  handleClose,
  userId,
  updateOnjobTrainingRecords
}) => {
  const { setAlertMessageState } = useAlertMessage();
  const [formData, setFormData] = useState({
    reportType: 'Training/Assessment',
    date: '',
    trainer: '',
    talk: '',
    talkTime: '',
    show: '',
    showTime: '',
    look: '',
    lookTime: '',
    confirm: '',
    confirmTime: '',
    competence: 'Constant Supervision Required'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const id = new Date().getTime(); // creates id for alert messages

    // Handle saving data here
    console.log('Form data:', formData);
    // Clear form data
    
    try {
      console.log('form data ok:)', formData);
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/addOnjobTraining`,
        { ...formData, user: userId },
        {
          withCredentials: true
        }
      );

      if (response.status === 200) {
        //setTrainingRecords(response.data.onjobTraining);
        handleClose();
        console.log('on jon', response.data.onJobTraining);
        updateOnjobTrainingRecords(response.data.onJobTraining);
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'On-Job Training Record Added',
              show: true,
              message: `Success! ${formData.reportType} Record has been added`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
      setFormData({
        reportType: 'Training/Assessment',
        date: '',
        trainer: '',
        talk: '',
        talkTime: '',
        show: '',
        showTime: '',
        look: '',
        lookTime: '',
        confirm: '',
        confirmTime: '',
        competence: 'Constant Supervision Required'
      });
  
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: Could not add on-job training record',
            show: true,
            message: `Error has occurred while adding on-job training record, please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error occurred while submitting on-job training record', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
    //handleClose(); // Close the modal
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New On-Job Training Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ margin: '0 16px' }}>
          <Form>
            <Form.Group>
              <Form.Label>Training Type</Form.Label>
              <Form.Control
                as="select"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
              >
                <option>Training/Assessment</option>
                <option>Induction</option>
                <option>Post-assessment Follow Up</option>
                <option>On/Off Job Training</option>
                <option>Moderation/Auditing</option>
                <option>Trainer Development</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Trainer</Form.Label>
              <Form.Control
                type="text"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>DISCUSSED: What was talked about...</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="talk"
                value={formData.talk}
                onChange={handleChange}
              />
              <Form.Control
                style={{ width: '100px', float: 'right', marginTop: '4px' }}
                type={'text'}
                name="talkTime"
                value={formData.talkTime}
                onChange={handleChange}
                placeholder="Time taken"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>DEMONSTRATED: What the trainee was shown...</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="show"
                value={formData.show}
                onChange={handleChange}
              />
              <Form.Control
                style={{ width: '100px', float: 'right', marginTop: '4px' }}
                type="text"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                placeholder="Time taken"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>OBSERVED: What was seen...</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="look"
                value={formData.look}
                onChange={handleChange}
              />
              <Form.Control
                style={{ width: '100px', float: 'right', marginTop: '4px' }}
                type="text"
                name="lookTime"
                value={formData.lookTime}
                onChange={handleChange}
                placeholder="Time taken"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>RECOMMENDATION: Ready for assessment or more training...</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
              />
              <Form.Control
                style={{ width: '100px', float: 'right', marginTop: '4px' }}
                type="text"
                name="confirmTime"
                value={formData.confirmTime}
                onChange={handleChange}
                placeholder="Time taken"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Competence</Form.Label>
              <Form.Control
                as="select"
                name="competence"
                value={formData.competence}
                onChange={handleChange}
              >
                <option>Constant Supervision Required</option>
                <option>Periodic Supervision Required</option>
                <option>Competent</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddOnjobTrainingRecordModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  updateOnjobTrainingRecords: PropTypes.func.isRequired
};

export default AddOnjobTrainingRecordModal;
