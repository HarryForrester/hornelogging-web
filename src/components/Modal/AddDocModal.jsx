import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';

/**
 * AddDocModal component for handling document selection.
 * @component
 * @param {Function} docSumbit - Function to be executed on submitting selected documents.
 * @returns  {JSX.Element} - Rendered component.
 */
const AddDocModal = ({ docSumbit }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();

  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Closes the Add Document Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddDocModalVisible: false,
      isSkidModalVisible: true
    }));
  };

  /**
   * Handles the change event when a checkbox is clicked for a file.
   * If the file has a valid _id and is not already selected, adds it to the selectedDocuments state.
   * @param {Object} fileUrl - The file object associated with the checkbox.
   * @returns {void}
   */
  const handleCheckboxChange = (fileUrl) => {
    // Check if the file has a valid _id and is not already in the selectedDocuments array
    if (
      fileUrl._id &&
      !skidModalState.selectedDocuments.some((selectedFile) => selectedFile._id === fileUrl._id)
    ) {
      // Update the selectedDocuments state by adding the new file
      //setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, fileUrl]);
      setSkidModalState((prevState) => ({
        ...prevState,
        selectedDocuments: [...prevState.selectedDocuments, fileUrl]
      }));
    }
  };

  return (
    <Modal show={skidModalState.isAddDocModalVisible} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Doc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="search-criteria-doc">Search:</label>
        <input
          type="text"
          className="form-control"
          size="30"
          placeholder="Search"
          id="search-criteria-doc"
        />
        <br />
        <div className="modal-hazards">
          {mapState.files.map((file) => (
            <div className="card" style={{ marginBottom: '10px' }} key={file.uri}>
              <div className="search-text-doc" style={{ display: 'none' }}>
                {file.searchText}
              </div>
              <div className="card-header" style={{ backgroundColor: file.color }}>
                <div style={{ float: 'left' }}>
                  <input
                    type="checkbox"
                    name="selectedDocs[]"
                    value={file.uri}
                    data-filename={file.fileName}
                    onChange={() => handleCheckboxChange(file)}
                  />
                  &nbsp;
                  <b>
                    <em>{file.fileName}</em>
                  </b>
                  &nbsp;&nbsp;
                  <small>({file.uri})</small>
                </div>
                <div style={{ float: 'right' }}>
                  <b>{file.type}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => docSumbit(skidModalState.selectedDocuments)}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDocModal;
