/* eslint-disable no-undef */
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Modal, Button, Spinner } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { usePersonData } from '../PersonData';
import PropTypes from 'prop-types';
import DragAndDropUpload from '../DragAndDropUpload';
import { getPresignedUrl, getFilePathFromUrl,uploadToPresignedUrl } from '../../hooks/useFileUpload';
const UploadLibraryDocumentModal = ({ show, close, docTypes: fileTypes, updateLibraryFiles, _account }) => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeIsValid, setFileTypeIsValid] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(null);
  const [showSpinner, setSpinner] = useState(false); // shows spinner while submitting to server
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileTypeValue, setFileTypeValue] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('defaultFileType'); // default value
  const { personDataState, setPersonDataState } = usePersonData();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const resetForm = () => {
    setFileName('');
    setSelectedFile(null);
    setFileIsValid(null);
    setFileTypeIsValid(null);
    setUploadPercentage(0);
    setSelectedFileType('defaultFileType');
    setSpinner(false);
  };

  const removeUploadedFile = () => {
    setFileName('');
    setSelectedFile(null);
    setSelectedFileType('defaultFileType');
  };

  const handleFileNameChange = (event) => {
    setFileName(event);
    setFileTypeIsValid(event ? true : null);
  };

  const handleFileTypeChange = (e) => {
    setFileTypeValue(e.target.value);
    setFileTypeIsValid(e.target.value ? true : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const id = new Date().getTime(); // creates id for alert messages

    if (!selectedFile) setFileIsValid(false);
    else if (selectedFileType === 'defaultFileType')
      setFileTypeIsValid(false); //name is not valid
    else {
      setSpinner(true); // show progress bar

      console.log('ajahjajha', _account)
      const [presignedUrl, key] = await getPresignedUrl(`${_account}/library`,selectedFile.type)
      await uploadToPresignedUrl(presignedUrl, selectedFile,selectedFile.type);
      const filePath = getFilePathFromUrl(presignedUrl)

      const data = {
        fileName: fileName || selectedFile.name,
        fileType: fileTypeValue,
        fileUrl: filePath,
        key: key
      }
      /* const formData = new FormData();
      formData.append('fileupload', selectedFile);
      formData.append('fileName', fileName);
      formData.append('fileType', fileTypeValue); */

      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/library/upload`, data, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercentage(percentage);
          }
        });

        if (response.status === 200) {
          updateLibraryFiles(response.data.files);
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Library File Uploaded',
                show: true,
                message: `Success! ${fileTypeValue} file ${fileName} has been uploaded successfully to Library`,
                background: 'success',
                color: 'white'
              }
            ]
          }));

          handleClose();
        }
      } catch (error) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Error',
              show: true,
              message: `Error has occurred while submitting ${fileTypeValue} file ${fileName} to Library, please try again`,
              background: 'danger',
              color: 'white'
            }
          ]
        }));

        console.error('Error submitting form:', error);
      } finally {
        setTimeout(() => {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: prevState.toasts.filter((toast) => toast.id !== id)
          }));
        }, 10000);
      }
    }
  };

  const handleClose = () => {
    close();
    resetForm();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title" id="uploadMapModalLabel">
          Upload Library File
        </h5>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Choose File: <small style={{ fontWeight: 'normal' }}>(required)</small>
              {fileIsValid === false && <span className="text-danger"> * File Required</span>}
            </Form.Label>
            <DragAndDropUpload
              setSelectedFile={setSelectedFile}
              setFileIsValid={setFileIsValid}
              selectedFile={selectedFile}
              removeUploadedFile={removeUploadedFile}
              fileTypes={{}}
            />
          </Form.Group>
          {selectedFile && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  Choose File Name: <small style={{ fontWeight: 'normal' }}>(optional)</small>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="file-name"
                  name="file-name"
                  value={fileName}
                  placeholder={selectedFile.name}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="fileType">
                <Form.Label>
                  Choose File Type: <small style={{ fontWeight: 'normal' }}>(required)</small>
                </Form.Label>
                <Form.Select
                  id="fileType"
                  name="filetype"
                  onChange={(e) => {
                    setSelectedFileType(e.target.value); // update selected file type
                    handleFileTypeChange(e);
                  }}
                  value={selectedFileType}
                  isInvalid={fileTypeIsValid === false}
                  required
                >
                  <option value="defaultFileType" disabled>
                    Select a file type
                  </option>
                  {fileTypes.map((fileType) => (
                    <option key={fileType._id} value={fileType.name}>
                      {fileType.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a file type.
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit}
          style={{ height: '38px', width: '100px', padding: 0, fontSize: 14 }}
        >
          {showSpinner ? (
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
    </Modal>
  );
};

UploadLibraryDocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  docTypes: PropTypes.array.isRequired,
  updateLibraryFiles: PropTypes.func.isRequired,
  _account: PropTypes.object.isRequired,
  };

export default UploadLibraryDocumentModal;
