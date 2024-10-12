import axios from 'axios';

// Base URL for your backend API
const API_URL = `${process.env.REACT_APP_BACKEND_API_URL}/api/admin` || 'http://localhost:5000/api/admin';  // Correct base URL
console.log('Backend API URL:', process.env.REACT_APP_BACKEND_API_URL);

// Fetch all users
export const fetchUsers = async () => {
    try {
      console.log('Fetching users from:', `${API_URL}/users`);  // Add logging to confirm the URL
      const response = await axios.get(`${API_URL}/users`);
      console.log('Users fetched:', response.data);  // Log the result
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

// Add a new user
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Toggle user active state
export const toggleUserActive = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/toggle-active`);
    return response;
  } catch (error) {
    console.error('Error toggling user active state:', error);
    throw error;
  }
};
