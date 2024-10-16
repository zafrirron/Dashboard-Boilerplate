import axios from 'axios';

// Base URL for your backend API
const API_URL = `${process.env.REACT_APP_BACKEND_API_URL}/api/admin` || 'http://localhost:5000/api/admin';  // Correct base URL
console.log('Backend API URL:', process.env.REACT_APP_BACKEND_API_URL);

// Fetch all records
export const fetchRecords = async () => {
    try {
      console.log('Fetching records from:', `${API_URL}/records`);  // Add logging to confirm the URL
      const response = await axios.get(`${API_URL}/records`);
      console.log('Records fetched:', response.data);  // Log the result
      return response;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  };

// Add a new record
export const addRecord = async (recordData) => {
  try {
    const response = await axios.post(`${API_URL}/records`, recordData);
    return response;
  } catch (error) {
    console.error('Error adding record:', error);
    throw error;
  }
};

// Delete a record
export const deleteRecord = async (id) => {
  try {
    await axios.delete(`${API_URL}/records/${id}`);
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
};
