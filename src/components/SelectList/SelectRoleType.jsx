import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
const SelectRoleType = ({ selectedRole, onChange }) => {
  const roleOptions = [
    'Loader Operator',
    'Hauler Operator',
    'Feller',
    'Skiddy',
    'Skidder Operator',
    'Breaker Out',
    'Health And Safety',
    'Office',
    'Crew Leader',
    'Foreman'
  ];

  return (
    <Form.Group className="col-md-5">
      <Form.Label htmlFor="roleInput" className="form-label">
        Role
      </Form.Label>
      <Form.Select
        id="roleInput"
        name="role"
        value={selectedRole || 'Select Role'}
        onChange={onChange}
        required
      >
        <option value="Select Role" disabled>
          Select Role
        </option>
        {roleOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

SelectRoleType.propTypes = {
  selectedRole: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
export default SelectRoleType;
