import React, { useState } from "react";

import axios from "axios";

const Playground = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    // API Gateway url to invoke function to generate presigned url
    const API_ENDPOINT = "https://zhba20ij25.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlUpload";
  
    // Function to generate the presigned url
    const getPresignedUrl = async () => {
      // GET request: presigned URL
      const response = await axios({
        method: "GET",
        url: API_ENDPOINT,
      });
      const presignedUrl = response.data.presignedUrl;
      console.log(presignedUrl);
      return presignedUrl;
    };
  
    // Function to upload the selected file using the generated presigned url
    const uploadToPresignedUrl = async (presignedUrl) => {
      // Upload file to pre-signed URL
      const uploadResponse = await axios.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": "application/png",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      console.log(uploadResponse);
    };
  
    // Function to orchestrate the upload process
    const handleUpload = async () => {
      try {
        // Ensure a file is selected
        if (!selectedFile) {
          console.error("No file selected.");
          return;
        }
  
        const presignedUrl = await getPresignedUrl();
        uploadToPresignedUrl(presignedUrl);
      } catch (error) {
        // Handle error
        console.error("Error uploading file:", error);
      }
    };
  
    return (
      <div className="App">
        <h1>File Selection Component</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    );
};
export default Playground;