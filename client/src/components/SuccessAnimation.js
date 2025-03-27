import React, { useEffect, useState } from 'react';

export default function SuccessAnimation({ show, emoji = '😃' }) {
  const [confetti, setConfetti] = useState([]);

  // Generate confetti elements for success animation
  useEffect(() => {
    if (show) {
      generateConfetti();
    }
  }, [show]);

  const generateConfetti = () => {
    const confettiCount = 50;
    const confettiElements = [];
    
    for (let i = 0; i < confettiCount; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      
      confettiElements.push(
        <div 
          key={i}
          className="confetti"
          style={{
            left: `${left}%`,
            animationDelay: `${animationDelay}s`
          }}
        ></div>
      );
    }
    
    setConfetti(confettiElements);
  };

  if (!show) return null;

  return (
    <div className="smiley-overlay">
      {confetti}
      <div className="smiley">{emoji}</div>
      <div className="success-message">Well done!</div>
    </div>
  );
}