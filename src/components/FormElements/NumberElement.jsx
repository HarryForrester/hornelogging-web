import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

function NumberElement(labelValue, itemValue) {
  return (
    <Form.Group className="mb-2" style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Form.Label>{labelValue}</Form.Label>
      <InputGroup>
        <Form.Control type="text" value={itemValue || ''} disabled />
      </InputGroup>
    </Form.Group>
  );
}

NumberElement.propTypes = {
  labelValue: PropTypes.string.isRequired,
  itemValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default NumberElement;
