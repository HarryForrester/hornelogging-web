import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';
import DragAndDropUpload from '../DragAndDropUpload';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl } from '../../hooks/useFileUpload';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UploadPdfModal = (_account) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { setAlertMessageState } = useAlertMessage();
  const { setMapState } = useMap();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleMapUpload = (file) => {
    setSelectedFile(file);
    setUploadError('');
  }

  const removeMapFile = () => {
    setSelectedFile(null);
    setUploadError('');
  }

  const handleSubmit = async (pdfName) => {
    const id = new Date().getTime();
    const [presignedUrl, key] = await getPresignedUrl(_account._account._account+"/maps", selectedFile.type);
    const filePath = getFilePathFromUrl(presignedUrl);
    
    try {
      await uploadToPresignedUrl(presignedUrl, selectedFile, selectedFile.type);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('id', pdfName);
      formData.append('url', filePath);
      formData.append('key', key);

      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/loadpdf', formData, { withCredentials: true });

      if (response.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Upload Map',
              show: true,
              message: `Success! ${pdfName} has been uploaded.`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        setMapState((prevState) => ({
          ...prevState,
          maps: response.data.maps,
          currentMapUrl: filePath
        }));

        setSkidModalState((prevState) => ({
          ...prevState,
          isUploadMapModalVisible: false
        }));
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Upload Map',
            show: true,
            message: `Error! An error occurred while uploading ${pdfName}. Please try again.`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error submitting form:', error);
    } finally {
      setSelectedFile(null);
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: false
    }));
    setSelectedFile(null);
  };

  return (
    <Modal
      show={skidModalState.isUploadMapModalVisible}
      onHide={handleClose}
      backdrop="static"
      centered
    >
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title" id="uploadMapModalLabel">
          Upload Map
        </h5>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Formik
          initialValues={{ pdfName: '' }}
          validationSchema={Yup.object({
            pdfName: Yup.string().max(20, 'Too Long!').required('Please provide a valid Map Name.'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            if (!selectedFile) {
              setUploadError('Please upload a PDF file.');
              setSubmitting(false);
              return;
            }
            handleSubmit(values.pdfName);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form id="map-upload-form">
              <div className="mb-3">
                <label htmlFor="pdfName">Map Name:</label>
                <Field
                  type="text"
                  className="form-control"
                  id="pdfName"
                  name="pdfName"                  
                />
                <ErrorMessage name="pdfName" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="map-upload">
                  Upload PDF Map
                </label>
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
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
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

export default UploadPdfModal;
