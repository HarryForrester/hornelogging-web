import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSkidModal } from './Skid/SkidModalContext';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DragAndDropUpload from '../DragAndDropUpload';
import { useSkid } from '../../context/SkidContext';
const AddCutPlanModal = ({ submitCutPlan }) => {
  const [selectedFile, setSelectedFile] = useState(null);
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
            submitCutPlan(values.fileName, selectedFile);
            setSubmitting(false);
            resetForm();
            handleClose();
          }}
        >
          {() => (
            <Form id="file-upload-form">
              <div className="form-group">
                <label htmlFor="file-upload">Upload PDF:</label>
                <DragAndDropUpload
                  setSelectedFile={setSelectedFile}
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
