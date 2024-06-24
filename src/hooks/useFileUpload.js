import axios from "axios";

export const getPresignedUrl = async (folderPath) => {
  // GET request: presigned URL
  const response = await axios({
    method: "GET",
    // eslint-disable-next-line no-undef
    url: 'https://zhba20ij25.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlUpload',
    params: { contentType: "application/pdf",
    folderPath: folderPath

    }
  });
  const presignedUrl = response.data.presignedUrl;
  const url = response.data.presignedUrl;
  console.log('im a fat cat',response);
  return presignedUrl;
};

 // Function to upload the selected file using the generated presigned url
 export const uploadToPresignedUrl = async (presignedUrl, selectedFile) => {
    // Upload file to pre-signed URL
    const uploadResponse = await axios.put(presignedUrl, selectedFile, {
      headers: {
        "Content-Type": "application/pdf",
      },
     
    });
    console.log(uploadResponse);
  };
