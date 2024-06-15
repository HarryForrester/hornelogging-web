import React from 'react';
import PropTypes from 'prop-types';

/**
 * Used for editing a person and editing their
 * @param {*} param0
 * @returns
 */
const FileInputWithLabel = ({ label, name, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={'file'}
        className="form-control"
        id={name}
        accept="application/pdf"
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};

FileInputWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FileInputWithLabel;
