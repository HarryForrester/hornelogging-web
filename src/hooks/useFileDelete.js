import axios from "axios";

export const deletePresignedUrl = async (keys) => {
    console.log('seik', keys)
  try {
    const response = await axios.delete(
      'https://tzoawzy8i9.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlDelete',
      {
        params: { keys: keys.join(',') }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting the object:', error);
    throw error;
  }
};
