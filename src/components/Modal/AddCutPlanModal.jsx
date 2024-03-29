import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';

const AddCutPlanModal = ({ submitCutPlan }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddCutPlanModalVisible: false,
      isSkidModalVisible: true
    }));
    // Reset the form state when closing the modal
    setSelectedFile(null);
    setFileName('');
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the selected file and file name to the submitCutPlan function
    submitCutPlan(fileName, selectedFile);

    // Reset the form state
    setSelectedFile(null);
    setFileName('');

    // Close the modal
    handleClose();
  };

  return (
    <Modal show={skidModalState.isAddCutPlanModalVisible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Cut Plan</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form id="file-upload-form" onSubmit={handleSubmit}>
          <label htmlFor="file-upload">Upload PDF:</label>
          <input
            type="file"
            className="form-control"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileChange}
          />

          <label htmlFor="file-name">File Name:</label>
          <input
            type="text"
            className="form-control"
            id="file-name"
            placeholder="Enter file name"
            value={fileName}
            onChange={handleFileNameChange}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="file-upload-form">
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCutPlanModal;
