import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, FormControl, ProgressBar, Form } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { usePersonData } from '../PersonData'
const PersonDocumentArticle = () => {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { personDataState, setPersonDataState } = usePersonData();

  const handleFileTypeChange = async (file, event) => {
    const id = new Date().getTime(); 
    const fileId = file._id
    try {
      const resp = await axios.post(`${process.env.REACT_APP_URL}/person/updatefiletype/${personDataState.person._id}/${fileId}`, { filetype: event.target.value }, {
        withCredentials: true
      });

      if (resp.status===200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: "Document Type Changed",
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
            heading: "Error",
            show: true,
            message: `Error has occurred while handling file type`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error("An error has occurred while handling file type");
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id),
      }));
      }, 10000)
    }
  }

  const handleFileUpload = async (e) => {
    const id = new Date().getTime(); 
    const fileInput = e.target;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("fileupload", file);

    try {

      const response = await axios.post(`${process.env.REACT_APP_URL}/person/upload/${personDataState.person._id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercentage(percentage);
        },
      });

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
              heading: "Person Document Added",
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
            heading: "Error",
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
          toasts: prevState.toasts.filter((toast) => toast.id !== id),
      }));
      }, 10000)
    }
  }

  const handleFileDelete = async (fileName, fileId) => {
    const id = new Date().getTime(); 

    const userConfirmed = window.confirm("Are you sure you want to remove file: " + fileName);
    if (userConfirmed) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/person/deletefile/${personDataState.person._id}/${fileId}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          //window.location.reload();
          setPersonDataState((prevState) => ({
            ...prevState,
            files: prevState.files.filter(file => file._id !== response.data.file._id)
          }));
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: "Person Document Added",
                show: true,
                message: `Success! ${fileName} has been removed to ${personDataState.person.name} documents `,
                background: 'success',
                color: 'white'
              }
            ]
          }));
        } else {
          alert("An Error has occurred, please try again.")
        }

      } catch (error) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: "Error",
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
            toasts: prevState.toasts.filter((toast) => toast.id !== id),
        }));
        }, 10000)
      }

    }
  }

  return (
    <article>
      <h1>Documents</h1>
      <Form encType="multipart/form-data">
        <div style={{ width: '100%' }}>
          <InputGroup className="mb-3">
            <FormControl
              type="file"
              id="customFile"
              name="fileupload"
              onChange={handleFileUpload}
            />
          </InputGroup>
          {uploadPercentage > 0 && uploadPercentage < 100 && (
            <ProgressBar
              variant="info"
              now={uploadPercentage}
              label={`Uploading: ${uploadPercentage}%`}
              className="mt-2"
            />
          )}

        </div>
      </Form>

      <dl>
        {personDataState.files.map((file) => (
          <React.Fragment key={file._id}>
            <dt className="fs-5 mb-1">
              <Form>
                <Form.Select
                  id={`filetype-${file._id}`}
                  name="filetype"
                  onChange={(e) => handleFileTypeChange(file, e)}
                  defaultValue={file.type}
                >
                  {personDataState.fileTypes.map((fileType) => (
                    <option
                      key={fileType}
                      value={fileType}
                    >
                      {fileType}
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </dt>
            <dd className="mb-1">
              {file.fileName}
              &nbsp;
              <a href={process.env.REACT_APP_URL + file.uri} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEye} color='black' />
              </a>
              &nbsp;&nbsp;
              <a href={process.env.REACT_APP_URL+file.uri} download={file.fileName} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDownload} color='black' />
              </a>
              &nbsp;
              <a
                style={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleFileDelete(file.fileName, file._id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} color='black' />
              </a>
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </article>
  );
};

export default PersonDocumentArticle;
