import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Form } from 'react-bootstrap';

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

const DragAndDropUpload = ({
  selectedFile,
  setSelectedFile,
  removeUploadedFile,
  fileTypes,
  id,
  error
}) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: fileTypes,
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
    maxFiles: 1
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

  return (
    <>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} id={id} data-testid="dragAndDropUpload" />
        <p>Drag and drop file here, or click to select file</p>
      </div>

      {selectedFile && (
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
      )}

      {error && (
        <Form.Control.Feedback type="invalid" style={{ display: 'block', marginTop: '10px', fontSize: 16 }}>
          {error}
        </Form.Control.Feedback>
      )}
    </>
  );
};

DragAndDropUpload.propTypes = {
  setSelectedFile: PropTypes.func.isRequired,
  selectedFile: PropTypes.object,
  removeUploadedFile: PropTypes.func.isRequired,
  fileTypes: PropTypes.any.isRequired,
  id: PropTypes.any.isRequired,
  error: PropTypes.string // New prop for error message
};

export default DragAndDropUpload;