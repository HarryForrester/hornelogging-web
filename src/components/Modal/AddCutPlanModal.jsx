import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkid } from '../../context/SkidContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DragAndDropUpload from '../DragAndDropUpload';
import PropTypes from 'prop-types';

const AddCutPlanModal = ({showModal, handleClose}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const { skidState, setSkidState } = useSkid();

  const removeUploadedFile = () => {
    setSelectedFile(null);
    setUploadError(''); // Clear the error when the file is removed
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    setUploadError(''); // Clear the error when a file is successfully added
  };

  /**
   * Handles the submission of a cut plan, converting the selected PDF file to base64.
   * Updates the Skid Modal state with the cut plan information and transitions back to the Skid Modal.
   * @param {string} fileName - The name of the cut plan file.
   * @param {File} selectedFile - The selected PDF file for the cut plan.
   * @returns {void}
   */
  const submitCutPlan = (fileName, selectedFile) => {
    const formik = skidState.formik;

    const tempFile = new File([selectedFile], fileName, {
      type: selectedFile.type,
      lastModified: selectedFile.lastModified
    });

    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        ...prevState.formik,
        values: {
          ...formik.values,
          selectedCutPlan: tempFile
        }
        // You may need to update touched and errors as well if applicable
      }
    }));  
    
  };

  return (
    <div data-testid="add-cutplan-modal">
      <Modal show={showModal} onHide={handleClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>Add Cut Plan</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={{ fileName: '' }}
            validationSchema={Yup.object({
              fileName: Yup.string().required('File name is required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              if (!selectedFile) {
                setUploadError('File is required');
                setSubmitting(false);
                return;
              }
              submitCutPlan(values.fileName, selectedFile);
              setSubmitting(false);
              resetForm();
              handleClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form id="file-upload-form">
                <div className="form-group">
                  <label htmlFor="file-name">File Name:</label>
                  <Field
                    type="text"
                    name="fileName"
                    className="form-control"
                    id="file-name"
                    placeholder="Enter file name"
                  />
                  <ErrorMessage
                    name="fileName"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="file-upload">Upload PDF:</label>
                  <DragAndDropUpload
                    id='file-upload'
                    setSelectedFile={handleFileUpload} // Update file and clear error
                    selectedFile={selectedFile}
                    removeUploadedFile={removeUploadedFile}
                    fileTypes={{ 'application/pdf': [] }}
                    error={uploadError}
                  />
                </div>

                <Modal.Footer>
                  <Button
                    variant="primary"
                    type="submit"
                    data-testid="addCutPlan-submit"
                    disabled={isSubmitting}
                  >
                    Save changes
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

AddCutPlanModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default AddCutPlanModal;
