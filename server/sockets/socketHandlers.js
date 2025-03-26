const CodeBlock = require('../models/CodeBlock');

// Room management object to track rooms and their participants
const rooms = {};


// Initialize Socket.IO handlers

function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Initialize tracking for which rooms the socket is part of and their roles
    socket.activeRooms = socket.activeRooms || {};
    
    // Handle user joining a room
    socket.on('join-room', async ({ roomId, username }) => {
      handleJoinRoom(io, socket, roomId, username);
    });

    // Handle code changes
    socket.on('code-change', ({ roomId, code }) => {
      handleCodeChange(socket, roomId, code);
    });

    // Handle solution check
    socket.on('check-solution', ({ roomId, code }) => {
      handleCheckSolution(socket, roomId, code);
    });

    // Handle user leaving a room
    socket.on('leave-room', ({ roomId }) => {
      if (socket.activeRooms && socket.activeRooms[roomId]) {
        delete socket.activeRooms[roomId];
      }
      
      handleUserDisconnect(io, socket.id, roomId, 'left');
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Check all rooms for this user and handle their departure
      Object.keys(rooms).forEach(roomId => {
        handleUserDisconnect(io, socket.id, roomId, 'disconnected');
      });
    });
  });
}


// Handle user joining a room with role assignment logic

async function handleJoinRoom(io, socket, roomId, username) {
  // Store username in socket data for reference
  socket.username = username || `User-${socket.id.substring(0, 5)}`;
  
  // Check if the user is already in this room to prevent duplicate role assignments
  if (socket.activeRooms && socket.activeRooms[roomId]) {
    console.log(`User ${socket.id} (${socket.username}) already in room ${roomId} as ${socket.activeRooms[roomId]}`);
    
    // Send the current room status (without rejoining)
    const isMentor = socket.activeRooms[roomId] === 'mentor';
    const studentsCount = rooms[roomId]?.students?.length || 0;
    
    socket.emit('room-status', { 
      isMentor, 
      studentsCount,
      initialJoin: false
    });
    
    // Resend current code state
    if (rooms[roomId]) {
      socket.emit('current-code', rooms[roomId].currentCode);
    }
    
    return;
  }
  
  // Create a room if it doesn't exist by fetching code block data from DB
  if (!rooms[roomId]) {
    try {
      const codeBlock = await CodeBlock.findById(roomId);
      if (codeBlock) {
        rooms[roomId] = {
          mentor: null,
          students: [],
          initialCode: codeBlock.initialCode,
          currentCode: codeBlock.initialCode,
          solution: codeBlock.solution
        };
      } else {
        socket.emit('error', { message: 'Code block not found' });
        return;
      }
    } catch (error) {
      console.error('Error fetching code block:', error);
      socket.emit('error', { message: 'Error fetching code block' });
      return;
    }
  }

  socket.join(roomId);
  
  // Initialize activeRooms if needed
  socket.activeRooms = socket.activeRooms || {};
  
  // ***ROLE ASSIGNMENT LOGIC***
  // If no mentor exists for this room, assign this user as mentor
  if (!rooms[roomId].mentor) {
    rooms[roomId].mentor = socket.id;
        socket.activeRooms[roomId] = 'mentor';
    
    // Send mentor status with initial data
    socket.emit('room-status', { 
      isMentor: true, 
      studentsCount: 0,
      initialJoin: true
    });
    
    // Send initial code to mentor
    socket.emit('current-code', rooms[roomId].currentCode);
    
    console.log(`User ${socket.id} (${socket.username}) joined room ${roomId} as mentor`);
  } else {

    // It's a student for this room
    if (!rooms[roomId].students.includes(socket.id)) {
      rooms[roomId].students.push(socket.id);
    }
    
    socket.activeRooms[roomId] = 'student';
    
    socket.emit('room-status', { 
      isMentor: false, 
      studentsCount: rooms[roomId].students.length,
      initialJoin: true
    });
    
    // Send initial and current code to student
    socket.emit('initial-code', rooms[roomId].initialCode);
    socket.emit('current-code', rooms[roomId].currentCode);
    
    // Update everyone about the new student count
    updateRoomStatus(io, roomId);
    
  }
}

// Handle code changes from any user
function handleCodeChange(socket, roomId, code) {
  if (rooms[roomId]) {
    rooms[roomId].currentCode = code;
    socket.to(roomId).emit('code-updated', code);
  }
}


// Check if submitted code matches the solution
function handleCheckSolution(socket, roomId, code) {
  if (rooms[roomId] && code.trim() === rooms[roomId].solution.trim()) {
    socket.emit('solution-correct', {
      message: 'Correct solution!',
      showGiantEmoji: true,
      emoji: '😃'
    });
    
  } 
}

// Helper function to update room status for all users
function updateRoomStatus(io, roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  // Update mentor with current student count
  if (room.mentor) {
    io.to(room.mentor).emit('room-status', {
      isMentor: true,
      studentsCount: room.students.length,
      initialJoin: false
    });
  }
  
  // Update all students with current student count
  room.students.forEach(studentId => {
    io.to(studentId).emit('room-status', {
      isMentor: false,
      studentsCount: room.students.length,
      initialJoin: false
    });
  });
}

// Helper function to handle user disconnect/leave
function handleUserDisconnect(io, socketId, roomId, reason = 'left') {
  const room = rooms[roomId];
  if (!room) return;

  // Get disconnect/leave user info 
  const socket = io.sockets.sockets.get(socketId);
  const username = socket?.username || `User-${socketId.substring(0, 5)}`;
  const isUserMentor = room.mentor === socketId;
  

  // ***MENTOR DEPARTURE HANDLING***
  if (isUserMentor) {
    // Notify all students that the mentor left
    io.to(roomId).emit('mentor-left');
    delete rooms[roomId];
  } 

  // ***STUDENT DEPARTURE HANDLING***
  else {
    // Remove student from the room
    const index = room.students.indexOf(socketId);
    if (index !== -1) {
      room.students.splice(index, 1);
      
      updateRoomStatus(io, roomId);
    }
  }
  
  // Clean up the user's active rooms record if the socket still exists
  if (socket && socket.activeRooms && socket.activeRooms[roomId]) {
    delete socket.activeRooms[roomId];
  }
}

module.exports = {
  initializeSocketHandlers,
  rooms  // Export rooms for potential future access
};