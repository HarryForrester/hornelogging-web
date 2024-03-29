import React from 'react';
import { Form } from 'react-bootstrap';

const SelectlistElement = (labelValue, itemSelected) => {
  return (
    <Form.Group className="mb-2 px-3">
      <Form.Label className="selectlist-label">{labelValue}</Form.Label>
      <Form.Control as="select" className="form-control" value={itemSelected}>
        <option>{itemSelected}</option>
      </Form.Control>
    </Form.Group>
  );
};

export default SelectlistElement;
