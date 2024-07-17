import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const InputWithLabel = ({ type, label, name, value, onChange }) => {
  return (
    <Form.Group controlId={name} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ height: '38px', width: '100%' }}
      />
    </Form.Group>
  );
};

InputWithLabel.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default InputWithLabel;
