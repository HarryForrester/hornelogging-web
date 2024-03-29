import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

function CheckboxElement({ labelValue, isChecked }) {
  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px' }}>
      <Col>
        <Form.Check inline type="checkbox" label={labelValue} checked={isChecked} disabled />
      </Col>
    </Form.Group>
  );
}

CheckboxElement.propTypes = {
  labelValue: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CheckboxElement;
