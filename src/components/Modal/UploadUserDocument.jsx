import React, { useState } from 'react';
import axios from 'axios';
import { Form, Modal, Button, Spinner } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import PropTypes from 'prop-types';
import DragAndDropUpload from '../DragAndDropUpload';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl} from '../../hooks/useFileUpload';
import { usePersonFile } from '../../context/PersonFileContext';
const UploadUserDocumentModal = ({ show, close, _account, person, setCurrentUserFiles}) => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeIsValid, setFileTypeIsValid] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileTypeValue, setFileTypeValue] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('defaultFileType'); // default value
  const { addToast } = useAlertMessage();
  const { personFiles } = usePersonFile();
  const resetForm = () => {
    setFileName('');
    setSelectedFile(null);
    setFileIsValid(null);
    setFileTypeIsValid(null);
    setUploadPercentage(0);
    setSelectedFileType('defaultFileType');
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
      setShowSpinner(true); // show progress bar
      const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${person._id}/docs`,selectedFile.type)
      await uploadToPresignedUrl(presignedUrl, selectedFile,selectedFile.type);
      const filePath = getFilePathFromUrl(presignedUrl)

      const data = {
        fileName: fileName || selectedFile.name,
        fileType: fileTypeValue,
        fileUrl: filePath,
        key: key
      }

      try {
        const response = await axios.post(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/person/upload/${person._id}`,
          data,
          {
            withCredentials: true,
          
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadPercentage(percentage);
            }
          }
        );

        if (response.status === 200) {
          setCurrentUserFiles((prevFiles) => [...prevFiles, response.data.file]);          
          addToast('File Uploaded!', `Success! ${fileTypeValue} file ${fileName} has been uploaded successfully`, 'success', 'white');
          handleClose();
        }
      } catch (error) {
        addToast('Error!', `Error has occurred while submitting ${fileTypeValue} file ${fileName}, please try again`, 'danger', 'white');
        console.error('Error submitting form:', error);
      } finally {
        setShowSpinner(false);
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
                  {personFiles &&
                    personFiles.personFileTypes &&
                    personFiles.personFileTypes.map((fileType) => (
                      <option key={fileType._id} value={fileType._id}>
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

UploadUserDocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  _account: PropTypes.number.isRequired,
  person: PropTypes.object.isRequired,
  setCurrentUserFiles: PropTypes.func.isRequired,
};

export default UploadUserDocumentModal;
