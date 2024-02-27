import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';

function NumberElement({labelValue, itemValue, onChange, disabled}) {
  return (
    <Form.Group as={Row} className="mb-2" style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Form.Label column sm="2">
        {labelValue}
      </Form.Label>
      <Col sm="10">
        <Form.Control
          type="number"
          value={itemValue || ''}
          onChange={onChange}
          disabled={disabled}
        />
      </Col>
    </Form.Group>
  );
}

export default NumberElement;
