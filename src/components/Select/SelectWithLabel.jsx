import React from 'react';
import PropTypes from 'prop-types';

/**
 * Used for editing a person and editing their
 * @param {*} param0
 * @returns
 */
const SelectWithLabel = ({ htmlFor, id, label, name, value, onChange, crewTypes }) => {
  return (
    <>
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
      <select className="form-control" id={id} name={name} value={value} onChange={onChange}>
        {crewTypes.map((crew) => (
          <option key={crew} value={crew}>
            {crew}
          </option>
        ))}
      </select>
    </>
  );
};

SelectWithLabel.propTypes = {
  htmlFor: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  crewTypes: PropTypes.array.isRequired

}

export default SelectWithLabel;
