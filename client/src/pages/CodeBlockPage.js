import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CodeBlockPage.css';

// Import custom components
import CodeEditor from '../components/CodeEditor';
import SuccessAnimation from '../components/SuccessAnimation';
import RoleNotification from '../components/RoleNotification';
import CodeBlockHeader from '../components/CodeBlockHeader';

// Import custom hooks
import useCodeBlock from '../hooks/useCodeBlock';
import useSocket from '../hooks/useSocket';

export default function CodeBlockPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [code, setCode] = useState('');
  const [initialCode, setInitialCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);
  const [showSmiley, setShowSmiley] = useState(false);
  const [emoji, setEmoji] = useState('😃');
  const [showRoleNotification, setShowRoleNotification] = useState(true);

  // Custom hooks
  const { codeBlock, loading, error } = useCodeBlock(id);

  // Socket event handlers
  const handleRoomStatus = ({ isMentor: mentor, studentsCount: count }) => {
    setIsMentor(mentor);
    setStudentsCount(count);
    setShowRoleNotification(true);
  };

  const handleInitialCode = (initialCodeFromServer) => {
    setInitialCode(initialCodeFromServer);
  };

  const handleCurrentCode = (currentCode) => {
    setCode(currentCode);
  };

  const handleCodeUpdated = (updatedCode) => {
    setCode(updatedCode);
  };

  const handleSolutionCorrect = (data) => {
    if (data && data.emoji) {
      setEmoji(data.emoji);
    }
    setShowSmiley(true);
    setTimeout(() => setShowSmiley(false), 4000);
  };

  const handleMentorLeft = () => {
    alert("The mentor left the room, we're going back to lobby...");
    navigate('/');
  };

  const handleForceLeave = () => {
    alert("The mentor left the room, we're going back to lobby...");
    navigate('/');
  };

  // Initialize socket connection
  const { handleCodeChange, leaveRoom } = useSocket({
    roomId: id,
    code,
    isMentor,
    onRoomStatus: handleRoomStatus,
    onInitialCode: handleInitialCode,
    onCurrentCode: handleCurrentCode,
    onCodeUpdated: handleCodeUpdated,
    onSolutionCorrect: handleSolutionCorrect,
    onMentorLeft: handleMentorLeft,
    onForceLeave: handleForceLeave
  });

  // Effect for role notification timeout
  useEffect(() => {
    let timeout;
    if (showRoleNotification) {
      timeout = setTimeout(() => {
        setShowRoleNotification(false);
      }, 5000);
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [showRoleNotification]);

  // Handle code change from editor
  const onCodeEditorChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Send the updated code if not mentor
    if (!isMentor) {
      handleCodeChange(newCode);
    }
  };

  // Function to handle returning to lobby
  const handleReturnToLobby = () => {
    leaveRoom();
    navigate('/');
  };
  
  // Reset code to initial state (for students only)
  const handleResetCode = () => {
    if (!isMentor && initialCode) {
      setCode(initialCode);
      handleCodeChange(initialCode);
    }
  };

  // Handle loading and error states
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!codeBlock) return <div className="error">Code block not found</div>;

  return (
    <div className="code-block-container">
      {/* Role notification component */}
      <RoleNotification 
        show={showRoleNotification} 
        isMentor={isMentor} 
        onClose={() => setShowRoleNotification(false)} 
      />
      
      {/* Header component */}
      <CodeBlockHeader 
        title={codeBlock.title}
        isMentor={isMentor}
        studentsCount={studentsCount}
        onReset={handleResetCode}
        onReturnToLobby={handleReturnToLobby}
      />
      
      {/* Description section */}
      <div className="code-block-description-container">
        <h3>Task Description:</h3>
        <p className="code-block-description">{codeBlock.description}</p>
      </div>
      
      {/* Code editor component */}
      <CodeEditor 
        code={code} 
        onChange={onCodeEditorChange} 
        isMentor={isMentor} 
      />
      
      {/* Success animation component */}
      <SuccessAnimation show={showSmiley} emoji={emoji} />
    </div>
  );
}