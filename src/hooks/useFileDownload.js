import axios from "axios";

const getPresignedDownloadUrl = async (fileKey) => {
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
export const createHandleDownloadClick = (file) => async (event) => {
  event.preventDefault();
  try {
    const presignedUrl = await getPresignedDownloadUrl(file.key);
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
