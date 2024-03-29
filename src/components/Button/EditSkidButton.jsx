import React from 'react';

const EditSkidButton = ({ onClick }) => {
  const buttonStyle = {
    position: 'absolute',
    width: '60px',
    height: '25px',
    top: '9px',
    right: '80px',
    background: 'blue',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    borderRadius: '5px',
    maxHeight: '30px'
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      Edit
    </button>
  );
};

export default EditSkidButton;
