/**
 * @file UploadPdfModal.jsx
 * @description Component for uploading a PDF map file within a modal dialog. 
 * It includes form validation, file upload functionality, and integrates with 
 * the backend to upload and store the PDF file.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';
import DragAndDropUpload from '../DragAndDropUpload';
import {
  getPresignedUrl,
  uploadToPresignedUrl,
  getFilePathFromUrl
} from '../../hooks/useFileUpload';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

/**
 * UploadPdfModal component provides a UI for users to upload a PDF map file.
 * It uses Formik for form state management and validation, and axios for handling
 * file uploads to the backend.
 *
 * @component
 * @param {Object} props - React props.
 * @param {string} props._account - The account identifier used to generate the presigned URL for the upload.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {function} props.setShow - Function to set the visibility of the modal.
 *
 * @returns {JSX.Element} Rendered component.
 */
const UploadPdfModal = ({ _account, show, setShow }) => {
  const { addToast } = useAlertMessage();
  const { setMapState } = useMap();

  // Local state to manage the selected file and upload error message.
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  /**
   * Handles the file selection and sets the selected file state.
   *
   * @param {File} file - The file object selected by the user.
   */
  const handleMapUpload = (file) => {
    setSelectedFile(file);
    setUploadError('');
  };

  /**
   * Resets the file selection and clears the upload error.
   */
  const removeMapFile = () => {
    setSelectedFile(null);
    setUploadError('');
  };

  /**
   * Submits the form and handles the file upload to the backend.
   *
   * @async
   * @param {string} pdfName - The name of the PDF file provided by the user.
   */
  const handleSubmit = async (pdfName) => {
    try {
      // Generate a presigned URL for uploading the file
      const [presignedUrl, key] = await getPresignedUrl(`${_account}/maps`, selectedFile.type);
      const filePath = getFilePathFromUrl(presignedUrl);

      // Upload the file to the generated presigned URL
      await uploadToPresignedUrl(presignedUrl, selectedFile, selectedFile.type);

      // Create a FormData object to send file data to the backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('id', pdfName);
      formData.append('url', filePath);
      formData.append('key', key);

      // Send a POST request to the backend to save the file details
      // eslint-disable-next-line no-undef
      const response = await axios.post(`${process.env.REACT_APP_URL}/loadpdf`, formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        addToast('Upload Map', `Success! ${pdfName} has been uploaded.`, 'success', 'white');

        // Update the map state with the newly uploaded map and set it as the current map URL
        setMapState((prevState) => ({
          ...prevState,
          maps: response.data.maps,
          currentMapUrl: filePath
        }));

        // Close the modal after successful upload
        setShow(false);
      }
    } catch (error) {
      addToast(
        'Upload Map',
        `Error! An error occurred while uploading ${pdfName}. Please try again.`,
        'danger',
        'white'
      );
      console.error('Error submitting form:', error);
    } finally {
      setSelectedFile(null); // Reset selected file after submission
    }
  };

  /**
   * Handles the modal close action and resets the selected file state.
   */
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title" id="uploadMapModalLabel">
          Upload Map
        </h5>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Formik
          initialValues={{ pdfName: '' }}
          validationSchema={Yup.object({
            pdfName: Yup.string().max(20, 'Too Long!').required('Please provide a valid Map Name.')
          })}
          onSubmit={(values, { setSubmitting }) => {
            if (!selectedFile) {
              setUploadError('Please upload a PDF file.');
              setSubmitting(false);
              return;
            }
            handleSubmit(values.pdfName);
            setSubmitting(false);
          }}>
          {({ isSubmitting }) => (
            <Form id="map-upload-form">
              <div className="mb-3">
                <label htmlFor="pdfName">Map Name:</label>
                <Field type="text" className="form-control" id="pdfName" name="pdfName" />
                <ErrorMessage name="pdfName" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="map-upload">Upload PDF Map</label>
                <DragAndDropUpload
                  id="map-upload"
                  setSelectedFile={handleMapUpload}
                  selectedFile={selectedFile}
                  removeUploadedFile={removeMapFile}
                  fileTypes={{ 'application/pdf': [] }}
                  error={uploadError}
                />
              </div>
              <Modal.Footer>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

UploadPdfModal.propTypes = {
  /**
   * The account identifier used for generating the presigned URL.
   */
  _account: PropTypes.any,

  /**
   * Boolean indicating if the modal should be visible.
   */
  show: PropTypes.bool.isRequired,

  /**
   * Function to set the visibility of the modal.
   */
  setShow: PropTypes.func.isRequired
};

export default UploadPdfModal;