import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const Library = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState(null);
  const [docList, setDocList] = useState([]);

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
          setDocList(response.data.doc);
          setFiles(response.data.files);
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

  const confirmDelete = (fileId) => {
    // Display a confirmation prompt
    const isConfirmed = window.confirm('Are you sure you want to delete this file?');

    // If the user confirms, navigate to the delete URL
    if (isConfirmed) {
      window.location.href = '/library/deletefile/' + fileId;
    } else {
      // Handle the case where the user canceled the deletion
      console.log('Deletion canceled');
    }
  };

  return (
    <>
      {/*       <script src="https://kit.fontawesome.com/318f8477e6.js" crossorigin="anonymous"></script>
       */}

      <div style={{ marginTop: '50px' }}>
        <div className="row no-gutters mb-4">
          <div className="col-md-6">
            <h2>Library</h2>
          </div>
          <div className="col-md-6 text-right">
            <input type="text" size="30" placeholder="Search" id="search-criteria" />
          </div>
        </div>

        <article>
          <h1>Documents</h1>
          <form action="/library/upload" method="post" encType="multipart/form-data">
            <div className="custom-file" style={{ width: '100%' }}>
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                name="fileupload"
                onChange={handleFileChange}
              />
              <label className="custom-file-label" htmlFor="customFile"></label>
            </div>
          </form>
          <dl>
            {files &&
              files.map((file) => (
                <React.Fragment key={file._id}>
                  <dt style={{ fontSize: 'medium' }}>
                    <form action={`/library/updatefiletype/${file._id}`} method="post">
                      <select
                        id="filetype"
                        name="filetype"
                        style={{ marginBottom: '-15px' }}
                        onChange={() =>
                          updateFileType(file._id, document.getElementById('filetype').value)
                        }
                      >
                        <option value="">Library</option>
                        {docList &&
                          docList.map((doc) => (
                            <option
                              key={doc.name}
                              value={doc.name}
                              selected={doc.name === file.type}
                            >
                              {doc.name}
                            </option>
                          ))}
                      </select>
                    </form>
                  </dt>
                  <dd>
                    {file.fileName}
                    &nbsp;
                    <a href={file.uri} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faEye} />
                    </a>
                    &nbsp;&nbsp;
                    <a
                      href={file.uri}
                      download={file.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                    &nbsp;
                    <a
                      style={{ marginLeft: 'auto' }}
                      href="#"
                      onClick={() => confirmDelete(file._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </a>
                  </dd>
                </React.Fragment>
              ))}
          </dl>
        </article>
      </div>
    </>
  );
};

export default Library;
