import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

function FreeformElement(labelValue, itemValue) {
  return (
    <Form.Group className="mb-2" style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Form.Label>{labelValue}</Form.Label>
      <InputGroup>
        <Form.Control type="text" value={itemValue || ''} disabled />
      </InputGroup>
    </Form.Group>
  );
}

export default FreeformElement;
