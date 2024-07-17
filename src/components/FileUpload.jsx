// components/FileUpload.js

import React from "react";
import useFileUpload from "../hooks/useFileUpload";

const FileUpload = (apiEndpoint) => {
  const {
    selectedFile,
    uploadProgress,
    uploadError,
    handleFileChange,
    handleUpload,
  } = useFileUpload(apiEndpoint);

  return (
    <div className="file-upload">
      <h1>File Upload Component</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
    </div>
  );
};

export default FileUpload;
