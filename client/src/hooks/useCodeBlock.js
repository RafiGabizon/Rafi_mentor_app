import { useState, useEffect } from "react";
import axios from "axios";
// API_BASE_URL is the base URL for the API server
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// useCodeBlock hook
// This hook fetches a code block by ID from the API server
export default function useCodeBlock(id) {
  const [codeBlock, setCodeBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/codeblocks/${id}`);
        setCodeBlock(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading code block");
        setLoading(false);
        console.error("Error fetching code block:", err);
      }
    };

    if (id) {
      fetchCodeBlock();
    }
  }, [id]);

  return {
    codeBlock,
    loading,
    error,
  };
}
