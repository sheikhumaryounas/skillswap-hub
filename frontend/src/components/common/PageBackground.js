import React from 'react';

/**
 * PageBackground Component
 * 
 * Provides an immersive background image with glass overlay for any page.
 * @param {string} imageName - The filename of the background image (e.g., 'dashboard-bg.png')
 */
const PageBackground = ({ imageName }) => {
  return (
    <div className="page-bg-overlay">
      <img 
        src={`/assets/images/${imageName}`} 
        alt="Background" 
        className="page-bg-img" 
      />
      <div className="glass-overlay-deep"></div>
    </div>
  );
};

export default PageBackground;
