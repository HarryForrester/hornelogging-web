import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RenderForm from '../FormElements/RenderForm';
import PropTypes from 'prop-types';

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

FormTemplateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
}

export default FormTemplateModal;
