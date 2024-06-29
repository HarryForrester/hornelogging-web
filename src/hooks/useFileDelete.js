import axios from "axios";

export const deletePresignedUrl = async (key) => {
  try {
    const response = await axios.delete(
      'https://tzoawzy8i9.execute-api.ap-southeast-2.amazonaws.com/hornePresignedUrlDelete',
      {
        params: { key:'2/maps/skids/c598792c-24be-4e3f-a081-8c1f150fd149.pdf' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting the object:', error);
    throw error;
  }
};
