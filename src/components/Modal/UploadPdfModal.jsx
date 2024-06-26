/* eslint-disable no-undef */
import React, { useState } from 'react';
import InputWithLabel from '../Input/InputWithLabel';
import FileInputWithLabel from '../Input/FileInputWithLabel';
import ErrorConfirmationModal from './ErrorConfirmationModal';
import axios from 'axios';
import { Form, Modal, Button, ProgressBar } from 'react-bootstrap';
import { SkidModalProvider, useSkidModal } from './Skid/SkidModalContext';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';
import Feedback from 'react-bootstrap/esm/Feedback';
import DragAndDropUpload from '../DragAndDropUpload';
import { getPresignedUrl, uploadToPresignedUrl } from '../../hooks/useFileUpload';
const UploadPdfModal = (_account) => {
  const [pdfName, setPdfName] = useState(null);
  //const [selectedPdf, setSelectedPdf] = useState(null);
  //const [showErrorModal, setShowErrorModal] = useState(false);
  const [pdfNameIsValid, setPdfNameIsValid] = useState(null);
  const [pdfFileIsValid, setPdfFileIsValid] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false); // shows spinner while submitting to server
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const { skidModalState, setSkidModalState } = useSkidModal();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { mapState, setMapState } = useMap();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(null);

  const handlePdfNameChange = (event) => {
    setPdfName(event);
    setPdfNameIsValid(event ? true : null);
  };
  const getFilePathFromUrl = (url) => {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  };
  const handlePdfInputChange = (event) => {
    const file = event.target.files[0];
    //setSelectedPdf(file);
    setSelectedFile(file);
    setPdfFileIsValid(event ? true : null);
  };

  const handleSubmit = async (event) => {
    setShowProgressBar(true);

    const id = new Date().getTime();

    event.preventDefault();

    if (!pdfName) {
      //setMessage("Please enter a name map name")
      setPdfNameIsValid(false);
      //setShowErrorModal(true);
    } else if (!selectedFile) {
      setPdfFileIsValid(false);
    } else {
      const presignedUrl = await getPresignedUrl(_account._account._account+"/maps");
        const filePath = getFilePathFromUrl(presignedUrl);
        console.log('filepath of the file', filePath);
        await uploadToPresignedUrl(presignedUrl, selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('id', pdfName);
      formData.append('url',filePath )

      try {
        
          const response = await axios.post(process.env.REACT_APP_URL + '/loadpdf', formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercentage(percentage);
          }
        });

        if (response.status === 200) {
          //window.location.reload();

          console.log('data ahahahah:', response.data);
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
              message: `Error! An error has occurred while uploading ${pdfName}. Please try again.`,
              background: 'danger',
              color: 'white'
            }
          ]
        }));
        console.error('Error submitting form:', error);
      } finally {
        setShowProgressBar(false);
        resetForm();

        setTimeout(() => {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: prevState.toasts.filter((toast) => toast.id !== id)
          }));
        }, 10000);
      }

      //submitPdf(pdfName, selectedPdf)
    }
  };
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const resetForm = () => {
    setPdfName(null);
    //setSelectedPdf(null);
    setSelectedFile(null);
    setPdfFileIsValid(null);
    setPdfNameIsValid(null);
    setUploadPercentage(0);
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: false
    }));

    resetForm();
  };

  const removeUploadedFile = () => {
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
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            {/* <InputWithLabel type={"text"} label={"Map Name:"} name={"pdf-name"} value={pdfName} onChange={handlePdfNameChange} required={true} /> */}
            <Form.Label>Map Name:</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="pdf-name"
              name="pdf-name"
              value={pdfName}
              onChange={(e) => handlePdfNameChange(e.target.value)}
              isValid={pdfNameIsValid === true}
              isInvalid={pdfNameIsValid === false}
              required
            />

            {pdfNameIsValid === false && (
              <Feedback type="invalid">Please provide a valid Map Name.</Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <FileInputWithLabel label={"Upload PDF Map"} name={"pdf-input"} onChange={handlePdfInputChange} /> */}
            <Form.Label>
              Upload PDF Map
              {fileIsValid === false && <span className="text-danger"> * File Required</span>}
            </Form.Label>
            <DragAndDropUpload
              setSelectedFile={setSelectedFile}
              setFileIsValid={setFileIsValid}
              selectedFile={selectedFile}
              removeUploadedFile={removeUploadedFile}
              fileTypes={{ 'application/pdf': [] }}
            />
            {/* <Form.Control
              type={'file'}
              className="form-control"
              id="pdf-input"
              accept="application/pdf"
              onChange={(e) => handlePdfInputChange(e)}
              isValid={pdfFileIsValid === true}
              isInvalid={pdfFileIsValid === false}
              required
            />
            {pdfFileIsValid === false && (
              <Feedback type="invalid">Please select a valid file.</Feedback>
            )}
 */}{' '}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose} style={{ height: '38px', fontSize: 14 }}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          style={{ height: '38px', width: '100px', padding: 0, fontSize: 14 }}
        >
          {showProgressBar ? (
            <ProgressBar
              animated
              now={uploadPercentage}
              label={`${uploadPercentage}%`}
              style={{ width: '100%', height: '100%', padding: 0 }}
            />
          ) : (
            'Upload Map'
          )}
        </Button>
      </Modal.Footer>
      {/*             <ErrorConfirmationModal message={message} onClose={closeErrorModal} show={showErrorModal}/>
       */}{' '}
    </Modal>
  );
};

export default UploadPdfModal;
