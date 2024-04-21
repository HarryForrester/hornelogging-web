import React, { useState, useCallback, useMemo } from 'react';
import InputWithLabel from '../Input/InputWithLabel';
import FileInputWithLabel from '../Input/FileInputWithLabel';
import ErrorConfirmationModal from './ErrorConfirmationModal';
import axios from 'axios';
import { Form, Modal, Button, ProgressBar, ListGroup } from 'react-bootstrap';
import { SkidModalProvider, useSkidModal } from './Skid/SkidModalContext';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';
import Feedback from 'react-bootstrap/esm/Feedback';
//import { FileUploader} from 'react-drag-drop-files';
import { useDropzone } from 'react-dropzone';
import { usePersonData } from '../PersonData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const bytesToKB = (bytes) => {
  return (bytes / 1024).toFixed(2); // Convert bytes to KB and round to 2 decimal places
};

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 5,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const UploadUserDocumentModal = ({ show, close }) => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fileTypeIsValid, setFileTypeIsValid] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false); // shows spinner while submitting to server
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileTypeValue, setFileTypeValue] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('defaultFileType'); // default value
  const { personDataState, setPersonDataState } = usePersonData();

  const { skidModalState, setSkidModalState } = useSkidModal();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { mapState, setMapState } = useMap();

  const onDrop = useCallback((acceptedFiles) => {
    //Do something with the files
    console.log('Dropping files into a faggot', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      console.log('accepted files: ', acceptedFiles[0]);
      setSelectedFile(acceptedFiles[0]);
      setFileIsValid(true);
    }
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

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
    console.log('ahdnle', e.target.value);
    setFileTypeValue(e.target.value);
    setFileTypeIsValid(e.target.value ? true : null);
  };

  const handlePdfInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileIsValid(event ? true : null);
  };

  const handleSubmit = async (event) => {
    console.log('handleSumbit', selectedFile);
    event.preventDefault();

    //setShowProgressBar(true); // show progress bar
    const id = new Date().getTime(); // creates id for alert messages

    if (!selectedFile) setFileIsValid(false);
    else if (selectedFileType === 'defaultFileType')
      setFileTypeIsValid(false); //name is not valid
    else {
      console.log('ALL OK FOR SUBMITTION');

      const formData = new FormData();
      formData.append('fileupload', selectedFile);
      formData.append('fileName', fileName);
      formData.append('fileType', fileTypeValue);

      console.log('formData:', formData);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/person/upload/${personDataState.person._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadPercentage(percentage);
            }
          }
        );

        if (response.status === 200) {
          //fileInput.value = '';
          setPersonDataState((prevState) => ({
            ...prevState,
            files: [...prevState.files, response.data.file]
          }));

          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'File Uploaded',
                show: true,
                message: `Success! ${fileTypeValue} file ${fileName} has been uploaded successfully`,
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
              message: `Error has occurred while submitting ${fileTypeValue} file ${fileName}, please try again`,
              background: 'danger',
              color: 'white'
            }
          ]
        }));
        //fileInput.value = '';

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
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const resetForm = () => {
    setFileName('');
    setSelectedFile(null);
    setFileIsValid(null);
    setFileTypeIsValid(null);
    setUploadPercentage(0);
  };

  const handleClose = () => {
    /* setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: false
    })); */
    close();

    resetForm();
  };

  return (
    <Modal
      show={show} //{skidModalState.isUploadMapModalVisible}
      onHide={handleClose}
      backdrop="static"
      centered
    >
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title" id="uploadMapModalLabel">
          Upload Employee File
        </h5>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Choose File: <small style={{ fontWeight: 'normal' }}>(required)</small>
              {fileIsValid === false && <span className="text-danger"> * File Required</span>}
            </Form.Label>

            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />

              <p>Drag and drop file here, or click to select file</p>
            </div>
          </Form.Group>
          {selectedFile && (
            <>
              <div className="my-2" style={{ width: '100%' }}>
                <div
                  style={{
                    borderStyle: 'dashed',
                    borderColor: 'green',
                    backgroundColor: 'rgba(144, 238, 144, 0.3)',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    borderRadius: '5px'
                  }}
                >
                  <FontAwesomeIcon icon={faFileAlt} size="lg" style={{ marginRight: '10px' }} />
                  <div>
                    <div style={{ position: 'absolute', top: '5px', left: '50px' }}>
                      {selectedFile?.name}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50px',
                        color: '#888',
                        fontSize: '10px'
                      }}
                    >
                      ({bytesToKB(selectedFile?.size)} KB)
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    onClick={removeUploadedFile}
                    size="sm"
                    style={{ marginLeft: 'auto' }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size="sm" />
                  </Button>
                </div>
              </div>

              <Form.Group className="mb-3">
                {/* <InputWithLabel type={"text"} label={"Map Name:"} name={"pdf-name"} value={pdfName} onChange={handlePdfNameChange} required={true} /> */}
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
                  {personDataState &&
                    personDataState.fileTypes &&
                    personDataState.fileTypes.map((fileType) => (
                      <option key={fileType} value={fileType}>
                        {fileType}
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
          {showProgressBar ? (
            <ProgressBar
              animated
              now={uploadPercentage}
              label={`${uploadPercentage}%`}
              style={{ width: '100%', height: '100%', padding: 0 }}
            />
          ) : (
            'Upload File'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

UploadUserDocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

export default UploadUserDocumentModal;
