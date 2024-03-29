import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TimeElement = (labelValue, itemValue) => {
  // Extract time part from ISO timestamp
  const timePart = new Date(itemValue).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Form.Label column sm="2">
        {labelValue}
      </Form.Label>
      <Col sm="10">
        <Form.Control type="time" className="form-control" readOnly value={timePart} />
      </Col>
    </Form.Group>
  );
};

TimeElement.propTypes = {
  labelValue: PropTypes.string.isRequired,
  itemValue: PropTypes.string.isRequired
};

export default TimeElement;
