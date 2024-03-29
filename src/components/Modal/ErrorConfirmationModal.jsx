import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useConfirmationModal } from '../ConfirmationModalContext';

const ErrorConfirmationModal = ({ message, show }) => {
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  //show: false,
  //confirmModalLabel: null,
  //confirmModalMessage: null,
  //confirmed: false

  const handleClose = () => {};

  return (
    <>
      <Modal show={true}>
        <Modal.Header className="text-bg-warning p-3">
          <Modal.Title>Are you sure?</Modal.Title>
          <Button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <p id="modal-message">bahah</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={handleClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ErrorConfirmationModal;
