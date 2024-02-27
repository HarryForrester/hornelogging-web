import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useConfirmationModal } from '../ConfirmationModalContext';

import { Anchor, ListGroup, ListGroupItem } from 'react-bootstrap';

const DeleteConfirmationModal = () => {
    const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();


    


    const handleClose = () => {
      setConfirmationModalState((prevState) => ({
        ...prevState,
        show: false,
        confirmed: false
      }));
    }

    const handleSubmit = () => {
      console.log("sumibt: ")
      setConfirmationModalState((prevState) => ({
        ...prevState,
        show: false,
        confirmed: true
      }));
    }


    

  return (
    <>
      <Modal show={confirmationModalState.show} onHide={handleClose} backdrop="static" centered >

        <Modal.Header closeButton>
          <Modal.Title>{confirmationModalState.label}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{confirmationModalState.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>No</Button>
          <Button variant="primary" onClick={handleSubmit}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
