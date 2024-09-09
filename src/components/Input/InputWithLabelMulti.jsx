import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const InputWithLabelMulti = ({ label, name, value, onChange, rows, placeholder }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="textarea"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ width: '100%' }}
      />
    </Form.Group>
  );
};

InputWithLabelMulti.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number,
  placeholder: PropTypes.string
};

InputWithLabelMulti.defaultProps = {
  rows: 3,
  placeholder: ''
};

export default InputWithLabelMulti;