import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const AddDocumentFileTypeModal = ({ submit, show, close }) => {
  const [name, setName] = useState(null);
  const [note, setNote] = useState(null);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  return (
    <Modal show={show} onHide={close} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>New Document Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="form-group">
            <Form.Label htmlFor="name" className="form-label">
              Document Type
            </Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="name"
              name="name"
              required
              onChange={handleNameChange}
            />
          </Form.Group>

          <Form.Label htmlFor="note">Notes (Optional)</Form.Label>
          <Form.Control
            type="text"
            className="form-control"
            id="note"
            name="note"
            onChange={handleNoteChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => submit(name, note)}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddDocumentFileTypeModal.propTypes = {
  submit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};
export default AddDocumentFileTypeModal;
