import React from 'react';

export default function RoleNotification({ show, isMentor, onClose }) {
  if (!show) return null;

  return (
    <div className={`role-notification ${isMentor ? 'mentor-notification' : 'student-notification'}`}>
      <span>You joined as a {isMentor ? 'Mentor' : 'Student'}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}