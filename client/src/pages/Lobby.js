import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Lobby.css';

export default function Lobby() {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
       const fetchCodeBlocks = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/codeblocks`);
            setCodeBlocks(response.data);
            setLoading(false);
        } catch (err) {
            setError("Error loading code blocks");
            setLoading(false);
            console.error("Error fetching code blocks:", err);
        }
        };

        fetchCodeBlocks();
    },[]);

    if(loading){
        return <div className='loading'>Loading...</div>;
    }
    if(error){
        return <div className='error'>{error}</div>;
    }
  return (
    <div className='lobby-container'>
        <h1>Choose a Code Block</h1>
        <div className='code-blocks-list'>
            {codeBlocks.map((block) => (
                <Link
                to={`/codeblock/${block._id}`}
                key={block._id}
                className="code-block-item"
                >
                    <h3>{block.title}</h3>
                    <p>{block.description}</p>
                </Link>
            ))}
        </div>
    </div>
  );
}