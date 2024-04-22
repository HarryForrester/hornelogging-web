import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash, faEye, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Button, Container } from 'react-bootstrap';
import UploadLibraryDocumentModal from '../components/Modal/UploadLibraryDocumentModal';
import { Card, ListGroup } from 'react-bootstrap';
import { useAlertMessage } from '../components/AlertMessage';
const Library = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState(null);
  const [fileTypes, setFileTypes] = useState([]);
  const [isUploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      console.log('yeaj bvro fucm');
      try {
        const response = await axios.get('http://localhost:3001/library', {
          withCredentials: true
        }); // Replace with your API endpoint

        if (response.data.isLoggedIn) {
          setUsername(response.data.username);
          setFileTypes(response.data.doc);
          setFiles(response.data.files);
          console.log('little cat hi there: ', response.data.doc);
        } else {
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          // Redirect to the login page if the error is due to unauthorized access
          navigate('/login');
        } else {
          console.error('Error fetching crews:', error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('file: ', file);
    uploadFile(file);
    // Handle file upload logic here
    // You can use fetch or another method to send the file to the server
    // Update state or perform any necessary actions after the upload
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('fileupload', file);
      const response = await axios.post(process.env.REACT_APP_URL + '/library/upload', formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Failed to create person');
      }
    } catch (error) {
      console.error('An error has occured while uploading file: ', error);
    }
  };

  const updateFileType = (fileId, fileType) => {
    // Handle updating file type logic here
    // You can use fetch or another method to send the updated type to the server
    // Update state or perform any necessary actions after updating the file type
  };

  const handleFileDelete = async (fileName, fileId) => {
    const id = new Date().getTime();

    const userConfirmed = window.confirm('Are you sure you want to remove file: ' + fileName);
    if (userConfirmed) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/library/deletefile/${fileId}`,
          {
            withCredentials: true
          }
        );

        if (response.status === 200) {
          setFiles(response.data.files);

          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Library Document Removed',
                show: true,
                message: `Success! ${fileName} has been removed from library documents `,
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
              heading: 'Error: Removing File',
              show: true,
              message: `Error removing file from library documents`,
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
  files.forEach((file) => {
    if (!filesByType[file.type]) {
      filesByType[file.type] = [];
    }
    filesByType[file.type].push(file);
  });

  const updateLibraryFiles = (files) => {
    setFiles(files);
  };

  return (
    <Container>
      <div style={{ marginTop: '50px' }}>
        <div className="row no-gutters mb-4">
          <div className="col-md-6">
            <h2>Library</h2>
          </div>
          <div className="col-md-6 text-right">
            <input type="text" size="30" placeholder="Search" id="search-criteria" />
          </div>
        </div>

        <Card>
          <Card.Header>Documents</Card.Header>
          <Card.Body>
            <UploadLibraryDocumentModal
              show={isUploadFileModalVisible}
              close={() => setUploadFileModalVisible(false)}
              docTypes={fileTypes}
              updateLibraryFiles={updateLibraryFiles}
            />

            <Button onClick={() => setUploadFileModalVisible(true)} className="mb-3 w-100">
              <FontAwesomeIcon icon={faUpload} color="white" className="me-1" />
              Upload File
            </Button>

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
                            href={process.env.REACT_APP_URL + file.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm text-decoration-none me-2"
                          >
                            <FontAwesomeIcon icon={faEye} className="me-1" />
                            View
                          </a>
                          {/* Download */}
                          <a
                            href={`${process.env.REACT_APP_URL}${file.uri}?download=true`}
                            download={file.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
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
                        onClick={() => handleFileDelete(file.fileName, file._id)}
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
      </div>
    </Container>
  );
};

export default Library;
