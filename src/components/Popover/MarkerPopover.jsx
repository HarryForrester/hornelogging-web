import React, { useState } from 'react';

const MarkerPopover = ({ markerContent }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverToggle = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={handlePopoverToggle}>{/* Your marker content goes here */}</div>
      {isPopoverOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            zIndex: 1,
          }}
        >
          {markerContent}
        </div>
      )}
    </div>
  );
};

export default MarkerPopover;
