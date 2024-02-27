import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';

function CheckboxElement({labelValue, isChecked, onChange}) {
  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px' }}>
      <Col>
        <Form.Check
          inline
          type="checkbox"
          label={labelValue}
          checked={isChecked}
          onChange={onChange}
          disabled
        />
      </Col>
    </Form.Group>
  );
}

export default CheckboxElement;
