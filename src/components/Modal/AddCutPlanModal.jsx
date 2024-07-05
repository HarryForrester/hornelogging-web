import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DragAndDropUpload from '../DragAndDropUpload';

const AddCutPlanModal = ({ submitCutPlan }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(null);

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddCutPlanModalVisible: false,
      isSkidModalVisible: true,
    }));
  };

  const removeUploadedFile = () => {
    setSelectedFile(null);
  };

  return (
    <Modal show={skidModalState.isAddCutPlanModalVisible} onHide={handleClose}>
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
            submitCutPlan(values.fileName, selectedFile);
            setSubmitting(false);
            resetForm();
            handleClose();
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form id="file-upload-form">
              <div className="form-group">
                <label htmlFor="file-upload">Upload PDF:</label>
                <DragAndDropUpload
                  setSelectedFile={setSelectedFile}
                  setFileIsValid={setFileIsValid}
                  selectedFile={selectedFile}
                  removeUploadedFile={removeUploadedFile}
                  fileTypes={{ 'application/pdf': [] }}
                />
              </div>

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
            </Form>
          )}
        </Formik>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="file-upload-form"
          disabled={!selectedFile}
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddCutPlanModal.propTypes = {
  submitCutPlan: PropTypes.func.isRequired,
};

export default AddCutPlanModal;
