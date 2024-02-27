import React from 'react';

/**
 * Used for editing a person and editing their
 * @param {*} param0 
 * @returns 
 */
const SelectWithLabel = ({ htmlFor, className, id,label, name, value, onChange, crewTypes }) => {
  return (
    <>
    <label htmlFor={htmlFor} className="form-label">{label}</label>
    <select
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    >
      {crewTypes.map((crew) => (
        <option key={crew} value={crew}>
          {crew}
        </option>
      ))}
    </select></>
  );
};

export default SelectWithLabel;
