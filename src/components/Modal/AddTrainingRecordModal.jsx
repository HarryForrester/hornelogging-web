import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
const AddTrainingRecordModal = ({
  employeeId,
  show,
  hide,
  setTrainingRecords,
  selectedRecord,
  setSelectedRecord,
  editMode
}) => {
  const [requirement, setRequirement] = useState('');
  const [unit, setUnit] = useState('');
  const [issued, setIssued] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [achievedDate, setAchievedDate] = useState('');
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const [_id, setId] = useState(null);

  useEffect(() => {
    setRequirement(selectedRecord?.requirement);
    setUnit(selectedRecord?.unit);
    setIssued(selectedRecord?.issued);
    setTargetDate(selectedRecord?.targetDate);
    setAchievedDate(selectedRecord?.achievedDate);
    setId(selectedRecord?._id);
  }, [selectedRecord]);

  const onClose = () => {
    hide();
    setSelectedRecord(null);
    setRequirement(null);
    setUnit('');
    setIssued(false);
    setTargetDate('');
    setAchievedDate('');
  };

  const handleSubmit = async () => {
    const id = new Date().getTime(); // creates id for alert messages

    const data = {
      _id,
      employee: employeeId,
      requirement,
      unit,
      issued,
      targetDate,
      achievedDate
    };
    console.log('handle me hehe', data);

    let url;

    if (editMode) {
      url = 'updateTrainingRecord';
    } else {
      url = 'addTrainingRecord';
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/${url}`, data, {
        withCredentials: true
      });

      if (response.status === 200) {
        setTrainingRecords(response.data.trainingRecords);
        onClose();

        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Training Record Added',
              show: true,
              message: `Success! ${requirement} has been added to Training Records`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: Could not add training record',
            show: true,
            message: `Error has occurred while adding training record, please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error occurred while submitting training record', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        {editMode ? 'Edit Existing Record' : 'Add New Record'}
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Training Required</Form.Label>
            <Form.Control
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Unit</Form.Label>
            <Form.Control type="number" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Check
              type="checkbox"
              checked={issued}
              onChange={(e) => setIssued(e.target.checked)}
              label="Paper has been issued"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Target Date</Form.Label>
            <Form.Control
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Archived Date</Form.Label>
            <Form.Control
              type="date"
              value={achievedDate}
              onChange={(e) => setAchievedDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>{editMode ? 'Save changes' : 'Add'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

AddTrainingRecordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
  setTrainingRecords: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectedRecord: PropTypes.object.isRequired,
  setSelectedRecord: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default AddTrainingRecordModal;
