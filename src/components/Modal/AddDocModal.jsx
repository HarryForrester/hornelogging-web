import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';

import { useSkid } from '../../context/SkidContext';

/**
 * AddDocModal component for handling document selection.
 * @component
 * @param {Function} docSubmit - Function to be executed on submitting selected documents.
 * @returns  {JSX.Element} - Rendered component.
 */
const AddDocModal = ({ docSubmit }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState } = useMap();
  const { skidState, setSkidState } = useSkid();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Closes the Add Document Modal and opens the Skid Modal by updating the state.
   * @function handleClose
   * @returns {void}
   */
  const handleClose = () => {
    setSkidState((prevState) => ({
      ...prevState,
      docModalVisible: false,
      skidModalVisible: true,
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
      const updatedSelectedDocuments = [...selectedDocuments, fileId];

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
      const updatedSelectedDocuments = selectedDocuments.filter(
        (selectedFile) => selectedFile !== fileId
      );
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

  const filteredFiles = mapState.files.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFiles = filteredFiles.reduce((acc, file) => {
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <br />
        <Accordion defaultActiveKey="0">
          {Object.keys(groupedFiles).map((type, index) => {
            const filesToShow = groupedFiles[type].filter(
              (file) =>
                skidState.formik &&
                skidState.formik.values &&
                !skidState.formik.values.selectedDocuments.some(
                  (selectedFile) => selectedFile === file._id
                )
            );

            return (
              <Accordion.Item eventKey={index.toString()} key={type}>
                <Accordion.Header>{type}</Accordion.Header>
                <Accordion.Body>
                  {filesToShow.map((file) => (
                    <div
                      className="card"
                      style={{ marginBottom: '10px', backgroundColor: file.color }}
                      key={file._id}
                    >
                      <div className="search-text-doc" style={{ display: 'none' }}>
                        {file.searchText}
                      </div>
                      <div className="card-header">
                        <div style={{ float: 'left' }}>
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
                          &nbsp;&nbsp;
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
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddDocModal.propTypes = {
  docSubmit: PropTypes.func.isRequired,
};

export default AddDocModal;
