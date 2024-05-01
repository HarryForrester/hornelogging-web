import React from 'react';
import PropTypes from 'prop-types';

const RemoveSkidButton = ({ onClick }) => {
  const buttonStyle = {
    position: 'absolute',
    width: '60px',
    height: '25px',
    top: '9px',
    right: '10px',
    background: 'red',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    borderRadius: '5px',
    maxHeight: '30px'
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      Remove
    </button>
  );
};

RemoveSkidButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default RemoveSkidButton;
