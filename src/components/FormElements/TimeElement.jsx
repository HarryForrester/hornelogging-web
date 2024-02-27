import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const TimeElement = ({ labelValue, itemValue }) => {
  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Form.Label column sm="2">
        {labelValue}
      </Form.Label>
      <Col sm="10">
        <Form.Control type="time" className="form-control" readOnly value={itemValue} />
      </Col>
    </Form.Group>
  );
};

export default TimeElement;
