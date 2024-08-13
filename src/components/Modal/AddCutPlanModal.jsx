import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkid } from '../../context/SkidContext';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DragAndDropUpload from '../DragAndDropUpload';

const AddCutPlanModal = ({ submitCutPlan }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const { skidState, setSkidState } = useSkid();

  const handleClose = () => {
    setSkidState((prevState) => ({
      ...prevState,
      cutPlanModalVisible: false,
      skidModalVisible: true,
    }));
  };

  const removeUploadedFile = () => {
    setSelectedFile(null);
    setUploadError(''); // Clear the error when the file is removed
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    setUploadError(''); // Clear the error when a file is successfully added
  };

  return (
    <Modal show={skidState.cutPlanModalVisible} onHide={handleClose} backdrop='static'>
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
  );
};

AddCutPlanModal.propTypes = {
  submitCutPlan: PropTypes.func.isRequired,
};

export default AddCutPlanModal;
