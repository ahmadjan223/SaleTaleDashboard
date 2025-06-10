import React from 'react';

const Tooltip = ({ text, visible, position }) => {
  if (!visible || !text) return null; // Only render if visible and has text
  return (
    <div 
      className="tooltip"
      style={{
        position: 'fixed',
        left: position.x + 10, 
        top: position.y + 10,  
        pointerEvents: 'none',
        whiteSpace: 'pre-line' 
      }}
    >
      {text} 
    </div>
  );
};

export default Tooltip; 