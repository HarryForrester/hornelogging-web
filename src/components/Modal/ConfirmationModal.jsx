import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const ConfirmationModal = ({ message, submit, show, close }) => {
  return (
    <Modal show={show} onHide={close} backdrop="static">
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => submit()}>
          Yes
        </Button>
        <Button variant="secondary" onClick={close}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};
export default ConfirmationModal;
