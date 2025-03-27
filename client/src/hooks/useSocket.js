import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { debounce } from 'lodash';

// SOCKET_SERVER_URL is the URL of the socket server
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// useSocket hook
// This hook manages the socket connection and event listeners for the code editor
export default function useSocket({
  roomId,
  username,
  code,
  isMentor,
  onRoomStatus,
  onInitialCode,
  onCurrentCode,
  onCodeUpdated,
  onSolutionCorrect,
  onSolutionIncorrect,
  onSolutionSubmitted,
  onMentorLeft,
  onForceLeave
}) {
  const [socket, setSocket] = useState(null);
  const [codeInitialized, setCodeInitialized] = useState(false);

  // Connect to socket when component mounts
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join room when socket and roomId are available
  useEffect(() => {
    if (socket && roomId) {
      // Generate a random username if not provided
      const effectiveUsername = username || `User-${Math.floor(Math.random() * 1000)}`;
      socket.emit('join-room', { roomId, username: effectiveUsername });
    }
  }, [socket, roomId, username]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Room status listener
    socket.on('room-status', (data) => {
      if (onRoomStatus) onRoomStatus(data);
    });

    // Initial code listener - for students
    socket.on('initial-code', (initialCodeFromServer) => {
      if (onInitialCode) onInitialCode(initialCodeFromServer);
      
      if (!codeInitialized) {
        if (onCurrentCode) onCurrentCode(initialCodeFromServer);
        setCodeInitialized(true);
      }
    });

    // Code updates from others
    socket.on('code-updated', (updatedCode) => {
      if (onCodeUpdated) onCodeUpdated(updatedCode);
    });

    // Mentor left event
    socket.on('mentor-left', () => {
      if (onMentorLeft) onMentorLeft();
    });

    // Force leave event
    socket.on('force-leave', (data) => {
      if (onForceLeave) onForceLeave(data);
    });

    // Current code listener
    socket.on('current-code', (currentCode) => {
      if (onCurrentCode) onCurrentCode(currentCode);
      
      if (!codeInitialized) {
        setCodeInitialized(true);
      }
    });

    // Solution feedback events
    socket.on('solution-correct', (data) => {
      if (onSolutionCorrect) onSolutionCorrect(data);
    });
    
    socket.on('solution-incorrect', (data) => {
      if (onSolutionIncorrect) onSolutionIncorrect(data);
    });
    
    socket.on('solution-submitted', (data) => {
      if (onSolutionSubmitted) onSolutionSubmitted(data);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('room-status');
      socket.off('initial-code');
      socket.off('code-updated');
      socket.off('mentor-left');
      socket.off('force-leave');
      socket.off('current-code');
      socket.off('solution-correct');
      socket.off('solution-incorrect');
      socket.off('solution-submitted');
    };
  }, [socket, codeInitialized, onRoomStatus, onInitialCode, onCurrentCode, onCodeUpdated, onSolutionCorrect, onSolutionIncorrect, onSolutionSubmitted, onMentorLeft, onForceLeave]);

  // Debounced code change handler - fixed with inline function
  const handleCodeChange = useCallback((newCode) => {
    const debouncedEmit = debounce((code) => {
      if (socket && roomId && !isMentor) {
        socket.emit('code-change', { roomId, code });
      }
    }, 100);
    
    debouncedEmit(newCode);
  }, [socket, roomId, isMentor]);

  // Check solution with debounce - fixed with inline function
  const checkSolution = useCallback((codeToCheck) => {
    const debouncedCheck = debounce((code) => {
      if (socket && roomId && !isMentor && code) {
        socket.emit('check-solution', { roomId, code });
      }
    }, 500);
    
    debouncedCheck(codeToCheck);
  }, [socket, roomId, isMentor]);

  // Effect to check solution when code changes
  useEffect(() => {
    if (codeInitialized && code) {
      checkSolution(code);
    }
  }, [code, checkSolution, codeInitialized]);

  // Function to leave room
  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit('leave-room', { roomId });
    }
  }, [socket, roomId]);

  return {
    socket,
    handleCodeChange,
    leaveRoom,
    isInitialized: codeInitialized
  };
}