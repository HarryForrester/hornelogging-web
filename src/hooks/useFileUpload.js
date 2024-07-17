import axios from "axios";

export const getPresignedUrl = async (folderPath, contentType) => {
  // GET request: presigned URL
  const response = await axios({
    method: "GET",
    // eslint-disable-next-line no-undef
    url: 'https://zhba20ij25.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlUpload',
    params: { 
      contentType: contentType,
      folderPath: folderPath

    }
  });
  const presignedUrl = response.data.presignedUrl;
  const key = response.data.key;
  console.log('im a fat cat',response);
  return [presignedUrl, key];
};

 // Function to upload the selected file using the generated presigned url
 export const uploadToPresignedUrl = async (presignedUrl, selectedFile,contentType) => {
    // Upload file to pre-signed URL
    const uploadResponse = await axios.put(presignedUrl, selectedFile, {
      headers: {
        "Content-Type": contentType,
      },
     
    });
    console.log(uploadResponse);
  };

  export const getFilePathFromUrl = (url) => {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  };
