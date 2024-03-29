import React from 'react';

/**
 * Used for editing a person and editing their
 * @param {*} param0
 * @returns
 */
const FileInputWithLabel = ({ type, label, name, value, onChange }) => {
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

export default FileInputWithLabel;
