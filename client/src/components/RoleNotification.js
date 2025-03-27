import React from 'react';

// RoleNotification component
// This component displays a notification when the user joins as a mentor or student
export default function RoleNotification({ show, isMentor, onClose }) {
  if (!show) return null;

  return (
    <div className={`role-notification ${isMentor ? 'mentor-notification' : 'student-notification'}`}>
      <span>You joined as a {isMentor ? 'Mentor' : 'Student'}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}