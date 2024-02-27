import React from 'react';

/**
 * Used for editing a person and editing their
 * @param {*} param0 
 * @returns 
 */
const InputWithLabel = ({ type,label, name, value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputWithLabel;
