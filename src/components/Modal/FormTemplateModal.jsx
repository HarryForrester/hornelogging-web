import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RenderForm from '../FormElements/RenderForm';

const FormTemplateModal = ({ show, onClose, form }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Form View</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Render your form component inside the Modal.Body */}
        <RenderForm form={form} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormTemplateModal;
