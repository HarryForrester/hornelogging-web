/* eslint-disable no-undef */
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import UploadUserDocumentModal from '../Modal/UploadUserDocument';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import { createHandleDownloadClick } from '../../hooks/useFileDownload';
import PropTypes from 'prop-types';
import { usePersonFile } from '../../context/PersonFileContext';
const PersonDocumentCard = ({_account, currentUser, currentUserFiles, setCurrentUserFiles}) => {
  const { addToast } = useAlertMessage();
  const { personFiles } = usePersonFile();
  const [isUploadFileModalVisible, setUploadFileModalVisible] = useState(false);

  const handleFileDelete = async (file) => {
    const userConfirmed = window.confirm('Are you sure you want to remove file: ' + file.fileName);

    if (userConfirmed) {
      console.log('user confirmed', userConfirmed);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/person/deletefile/${file._id}`,
          {
            withCredentials: true
          }
        );

        if (response.status === 200) {
          await deletePresignedUrl([file.key]);
          setCurrentUserFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
          addToast('Person Document Removed!', `Success! ${file.fileName} has been removed from ${currentUser.name} documents`, 'success', 'white');
        } else {
          addToast('Error!', 'An Error has occurred while deleting file, please try again', 'danger', 'white');
        }
      } catch (error) {
        addToast('Error!', 'An Error has occurred while deleting file, please try again', 'danger', 'white');
        console.error('Error removing document:', error);
      }
    }
  };

  const filesByType = {};
  currentUserFiles.forEach((file) => {
    if (!filesByType[file.type]) {
      filesByType[file.type] = [];
    }
    filesByType[file.type].push(file);
  });

  return (
    <Card>
      <Card.Header>Employee Files</Card.Header>
      <Card.Body>
        {/* Upload modal */}
        <UploadUserDocumentModal
          show={isUploadFileModalVisible}
          close={() => setUploadFileModalVisible(false)}
          _account={_account}
          person={currentUser}
          setCurrentUserFiles={setCurrentUserFiles}
        />

        {/* Upload button */}
        <Button onClick={() => setUploadFileModalVisible(true)} className="mb-3">
          <FontAwesomeIcon icon={faUpload} color="white" className="me-1" />
          Upload File
        </Button>

        {/* File list */}
        {Object.entries(filesByType).map(([fileType, files]) => {
          const matchingFileType = personFiles.personFileTypes.find((type) => type._id === fileType);

          return(
          <div key={fileType} className="mb-4">
            <h5>{matchingFileType ? matchingFileType.name : 'Unknown File Type'}</h5>
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
        )})}
      </Card.Body>
    </Card>
  );
};

PersonDocumentCard.propTypes = {
  _account: PropTypes.number.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserFiles: PropTypes.array.isRequired,
  setCurrentUserFiles: PropTypes.func.isRequired,
}

export default PersonDocumentCard;
