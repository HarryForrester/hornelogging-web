import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const GeneratedPasswordModal = ({ message, submit, show, close }) => {
  return (
    <Modal show={show} onHide={close} backdrop="static">
        <Modal.Header>
            <Modal.Title>Generated Password</Modal.Title>
        </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

GeneratedPasswordModal.propTypes = {
  message: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};
export default GeneratedPasswordModal;
