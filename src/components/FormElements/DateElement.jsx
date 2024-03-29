import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const DateElement = (labelValue, itemValue) => {
  const formattedDate = itemValue ? new Date(itemValue).toISOString().split('T')[0] : '';
  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Form.Label column sm="2">
        {labelValue}
      </Form.Label>
      <Col sm="10">
        <Form.Control type="date" className="form-control" readOnly value={formattedDate} />
      </Col>
    </Form.Group>
  );
};

export default DateElement;
