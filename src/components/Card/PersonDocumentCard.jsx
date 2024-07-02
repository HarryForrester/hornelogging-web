/* eslint-disable no-undef */
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { usePersonData } from '../PersonData';
import UploadUserDocumentModal from '../Modal/UploadUserDocument';
import { deletePresignedUrl } from '../../hooks/useFileDelete';

const PersonDocumentCard = (_account) => {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { personDataState, setPersonDataState } = usePersonData();
  const [isUploadFileModalVisible, setUploadFileModalVisible] = useState(false);

  const handleFileTypeChange = async (file, event) => {
    const id = new Date().getTime();
    const fileId = file._id;
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/person/updatefiletype/${personDataState.person._id}/${fileId}`,
        { filetype: event.target.value },
        {
          withCredentials: true
        }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Document Type Changed',
              show: true,
              message: `Success! ${file.fileName} has changed file type to ${event.target.value} `,
              background: 'success',
              color: 'white'
            }
          ]
        }));
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
            message: `Error has occurred while handling file type`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error has occurred while handling file type');
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleFileUpload = async (e) => {
    const id = new Date().getTime();
    const fileInput = e.target;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('fileupload', file);

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
        fileInput.value = '';
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
              heading: 'Person Document Added',
              show: true,
              message: `Success! ${file.name} has been added to ${personDataState.person.name} documents `,
              background: 'success',
              color: 'white'
            }
          ]
        }));
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
            message: `Error has occurred while submitting document, please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      fileInput.value = '';

      console.error('Error submitting form:', error);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleFileDelete = async (file) => {
    const id = new Date().getTime();
    const userConfirmed = window.confirm('Are you sure you want to remove file: ' + file.fileName);

    if (userConfirmed) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/person/deletefile/${file._id}`,
          {
            withCredentials: true
          }
        );

        if (response.status === 200) {
          await deletePresignedUrl([file.key]);
          setPersonDataState((prevState) => ({
            ...prevState,
            files: prevState.files.filter((f) => f._id !== file._id)
          }));
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Person Document Removed',
                show: true,
                message: `Success! ${file.fileName} has been removed from ${personDataState.person.name} documents `,
                background: 'success',
                color: 'white'
              }
            ]
          }));
        } else {
          alert('An Error has occurred, please try again.');
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
              message: `Error removing document`,
              background: 'danger',
              color: 'white'
            }
          ]
        }));
        console.error('Error removing document:', error);
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

  const filesByType = {};
  personDataState.files.forEach((file) => {
    if (!filesByType[file.type]) {
      filesByType[file.type] = [];
    }
    filesByType[file.type].push(file);
  });

  // Function to get the presigned URL
  const getPresignedUrl = async (fileKey) => {
    console.log('AHAHA', fileKey);
    try {
      const response = await axios.get('https://h0djh63zwj.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlDownload', {
        params: { file_key: fileKey },
      });
      console.log("REPSONSE:", response)
      return response.data.url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }
  };

  // Wrap handleDownloadClick to pass file as parameter
  const createHandleDownloadClick = (file) => async (event) => {
    console.log("pressed file o", file)
    event.preventDefault();
    try {
      const presignedUrl = await getPresignedUrl(file.key);
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Card>
      <Card.Header>Employee Files</Card.Header>
      <Card.Body>
        {/* Upload modal */}
        <UploadUserDocumentModal
          show={isUploadFileModalVisible}
          close={() => setUploadFileModalVisible(false)}
          _account={_account}
        />

        {/* Upload button */}
        <Button onClick={() => setUploadFileModalVisible(true)} className="mb-3">
          <FontAwesomeIcon icon={faUpload} color="white" className="me-1" />
          Upload File
        </Button>

        {/* File list */}
        {Object.entries(filesByType).map(([fileType, files]) => (
          <div key={fileType} className="mb-4">
            <h5>{fileType}</h5>
            <ListGroup>
              {files.map((file) => (
                <ListGroup.Item
                  key={file._id}
                  className="d-flex justify-content-between align-items-center border-0"
                  style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}
                >
                  <div className="d-flex flex-column">
                    <span className="fs-6">{file.fileName}</span>
                    <div className="d-flex">
                      {/* View */}
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm text-decoration-none me-2"
                      >
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        View
                      </a>
                      {/* Download */}
                      <a
                        href="#"
                        onClick={createHandleDownloadClick(file)}
                        className="btn btn-outline-secondary btn-sm text-decoration-none me-2"
                      >
                        <FontAwesomeIcon icon={faDownload} className="me-1" />
                        Download
                      </a>
                    </div>
                  </div>
                  {/* Delete */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleFileDelete(file)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default PersonDocumentCard;
