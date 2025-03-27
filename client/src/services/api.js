import axios from 'axios';

const API_URL = 'https://rafi-mentor-server.onrender.com';

// get all code blocks
export const getCodeBlocks = async () => {
  try {
    const response = await axios.get(`${API_URL}/codeblocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    throw error;
  }
};

// get a code block by ID
export const getCodeBlockById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/codeblocks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching code block with ID ${id}:`, error);
    throw error;
  }
};