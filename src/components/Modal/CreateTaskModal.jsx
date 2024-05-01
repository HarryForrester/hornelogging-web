import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CreateTaskModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} aria-labelledby="myModalLabel" centered>
      <Modal.Header closeButton>
        <Modal.Title id="myModalLabel">Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginLeft: '16px', marginRight: '16px' }}>
          <Form id="taskForm">
            <Form.Group controlId="inputTo3">
              <Form.Label>Attn</Form.Label>
              <Form.Control type="text" placeholder="Attn" name="to" />
            </Form.Group>
            <Form.Group controlId="inputSubject3">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Subject" name="subject" />
            </Form.Group>
            <Form.Group controlId="inputPriority3">
              <Form.Label>Priority</Form.Label>
              <Form.Control as="select" name="priority">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="inputDetail3">
              <Form.Label>Detail</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="Detail" name="detail" />
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" className="saveNewTaskBtn" onClick={onHide}>
          Save Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CreateTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default CreateTaskModal;
