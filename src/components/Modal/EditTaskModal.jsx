import React from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';
import { findNameById } from '../../utils/FindNameById';

const EditTaskModal = ({ show, onHide, task, people, crews, setTasks }) => {
  console.log('the fucking task: ', task);

  const handleRemoveTask = async () => {
    console.log('remove task: ', task._id);

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/removeTask/${task._id}`, {}, {withCredentials: true});

      if (response.status === 200) {
        console.log("success: ", response.data);
        setTasks(response.data.tasks);
        onHide();
      }
    } catch (error) {
      console.error('An error occurred while removing  task', error);
    }
  }

  const colour =
    task?.priority === 'Low'
      ? 'success'
      : task?.priority === 'Medium'
        ? 'warning'
        : task?.priority === 'High'
          ? 'danger'
          : 'info';

  const formik = useFormik({
    initialValues: {
      note: ''
    },
    /* validationSchema: Yup.object().shape({
      to: Yup.array().required('Attn is required').min(1, 'At least one attn must be selected'),
      from: Yup.string().required('from is required'),
      subject: Yup.string().required('Subject is required'),
      priority: Yup.string().required('Priority is required'),
      body: Yup.string().required('body is required'),
      date: Yup.date().required('date is required'),
    }),
 */ onSubmit: async (values, { resetForm }) => {
      // Handle form submission here
      console.log('haha bebe: ', values);

      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/updateTask/${task._id}`, {note: values.note}, {withCredentials: true});
        
        if (response.status === 200) {
            console.log("yippt", response.data);
            setTasks(response.data.tasks);
            formik.handleReset();
            onHide();
        }
      } catch (error) {
        console.error("an error occurred while submitting updated task")
      }
    }
  });

  return (
    <Modal
      show={show}
      onHide={() => {
        formik.handleReset();
        onHide();
      }}
      aria-labelledby="myModalLabel"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="myModalLabel">Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="taskForm" onSubmit={formik.handleSubmit}>
          <Card border={colour}>
            <Card.Header className={`bg-${colour} text-white`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <b>Attn: </b>
                  {findNameById(task?.to, people, crews)}
                </div>
                <div>
                  <b>Subject: </b>
                  {task?.subject}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className={`message-bubble-align ${task?.from === 'Office' ? 'office' : ''}`}>
                <div className={`message-bubble ${task?.from === 'Office' ? 'office' : ''}`}>
                  <p>
                    <b style={{ textAlign: 'left' }}>{task?.from}</b>{' '}
                    <small style={{ color: '#999', fontSize: '0.7em', marginLeft: '8px' }}>
                      - {moment(task?.date).format('DD MMM hh:mm a')}
                    </small>
                  </p>
                  <p>{task?.body}</p>
                </div>
              </div>

              {task?.notes &&
                task?.notes.map((note) => {
                  let msgBody = note.body;
                  if (note.body === "Yes, I'm dealing with this.") {
                    msgBody = (
                      <>
                        <span className="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;{msgBody}
                      </>
                    );
                  }
                  const noteMessageAlign = note.from === 'Office' ? 'text-right' : 'text-left';

                  return (
                    <div
                      key={note._id}
                      className={`message-bubble-align ${note.from === 'Office' ? 'office' : ''}`}
                    >
                      <div className={`message-bubble ${note.from === 'Office' ? 'office' : ''}`}>
                        <p>
                          <b>{note.from}</b>{' '}
                          <small style={{ color: '#999', fontSize: '0.7em', marginLeft: '8px' }}>
                            - {moment(note.date).format('DD MMM hh:mm a')}
                          </small>
                        </p>
                        <p>{msgBody}</p>
                      </div>
                    </div>
                  );
                })}
              <Form.Group controlId="additionalInput">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter note"
                  name="note"
                  rows={4}
                  value={formik.values.note}
                  onChange={formik.handleChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          <Form.Group className="mt-2">
            <div className="d-flex justify-content-between">
               <Button variant="danger" onClick={handleRemoveTask}>Remove</Button>
               <Button variant="primary" type="submit" className="saveNewTaskBtn">
                Save Task
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

EditTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired,
  crews: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default EditTaskModal;
