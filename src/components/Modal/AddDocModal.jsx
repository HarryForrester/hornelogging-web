import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { useSkid } from '../../context/SkidContext';
/**
 * AddDocModal component for handling document selection.
 * @component
 * @param {Function} docSumbit - Function to be executed on submitting selected documents.
 * @returns  {JSX.Element} - Rendered component.
 */
const AddDocModal = ({ docSumbit }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { skidState, setSkidState} = useSkid();
  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Closes the Add Document Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    setSkidState((prevState) => ({
      ...prevState,
      docModalVisible: false,
      skidModalVisible: true
    }));
  };

  /**
   * Handles the change event when a checkbox is clicked for a file.
   * If the file has a valid _id and is not already selected, adds it to the selectedDocuments state.
   * @param {Object} fileUrl - The file object associated with the checkbox.
   * @returns {void}
   */
  const handleCheckboxChange = (fileUrl) => {
    if (!skidState.formik || !skidState.formik.values) {
      console.error('formik or formik.values is null or undefined');
      return;
    }
  
    const { formik } = skidState;
    const { selectedDocuments } = formik.values;
    const fileId = fileUrl._id;
  
    if (!selectedDocuments.some((selectedFile) => selectedFile._id === fileId)) {
      // Add to selectedDocuments
      const updatedSelectedDocuments = [...selectedDocuments, { _id: fileId }];
      setSkidState((prevState) => ({
        ...prevState,
        formik: {
          ...formik,
          values: {
            ...formik.values,
            selectedDocuments: updatedSelectedDocuments,
          },
        },
      }));
    } else {
      // Remove from selectedDocuments
      const updatedSelectedDocuments = selectedDocuments.filter((selectedFile) => selectedFile._id !== fileId);
      setSkidState((prevState) => ({
        ...prevState,
        formik: {
          ...formik,
          values: {
            ...formik.values,
            selectedDocuments: updatedSelectedDocuments,
          },
        },
      }));
    }
  };
  
  const groupedFiles = mapState.files.reduce((acc, file) => {
    if (!acc[file.type]) {
      acc[file.type] = [];
    }
    acc[file.type].push(file);
    return acc;
  }, {});

  return (
    <Modal show={skidState.docModalVisible} onHide={handleClose}>
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
        {Object.keys(groupedFiles).map((type) => (
  <React.Fragment key={type}>
    <h5>{type}</h5>
    {groupedFiles[type]  
      .filter(file => skidState.formik && skidState.formik.values && !skidState.formik.values.selectedDocuments.some(selectedFile => selectedFile._id === file._id))
      .map((file) => (
            <div className="card" style={{ marginBottom: '10px' }} key={file._id}>
              <div className="search-text-doc" style={{ display: 'none' }}>
                {file.searchText}
              </div>
              <div className="card-header" style={{ backgroundColor: file.color }}>
                <div style={{ float: 'left' }}>
                  <b>{file.type}</b>
                  &nbsp;
                  <b>
                    <em
                      style={{
                        maxWidth: '300px',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {file.fileName}
                    </em>
                  </b>
                  &nbsp;&nbsp;
                  <small>({file.uri})</small>
                </div>
                <div style={{ float: 'right' }}>
                  
                    <Button
                      type="button"
                      data-filename={file.fileName}
                      onClick={() => handleCheckboxChange(file)}
                      size="sm"
                    >
                      Add
                    </Button>
                  
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}



        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddDocModal.propTypes = {
  docSumbit: PropTypes.func.isRequired
};

export default AddDocModal;
