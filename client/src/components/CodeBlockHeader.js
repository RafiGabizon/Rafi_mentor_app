import React from 'react';

// component for the header of the code block
// displays the title, role badge, number of students, and buttons to reset code and return to lobby
export default function CodeBlockHeader({ 
  title, 
  isMentor, 
  studentsCount, 
  onReset, 
  onReturnToLobby 
}) {
  return (
    <div className="code-block-header">
      <div className="title-area">
        <h1>{title}</h1>
        <div className={`role-badge ${isMentor ? 'mentor-badge' : 'student-badge'}`}>
          {isMentor ? 'MENTOR' : 'STUDENT'}
        </div>
      </div>
      <div className="code-block-status">
        <span className="students-count">
          <i className="fas fa-users"></i> {studentsCount} Student{studentsCount !== 1 ? 's' : ''}
        </span>
        {!isMentor && (
          <button 
            className="reset-code-btn" 
            onClick={onReset}
            title="Reset to original code"
          >
            Reset Code
          </button>
        )}
        <button 
          className="return-to-lobby-btn" 
          onClick={onReturnToLobby}
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}