import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
