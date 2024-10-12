import axios from 'axios';

// Fetch Swagger docs with authorization
export const fetchApiDocs = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api-docs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;  // Return the Swagger docs data
  } catch (error) {
    console.error('Error fetching Swagger docs:', error);
    throw error;
  }
};
