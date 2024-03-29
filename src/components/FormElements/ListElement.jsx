import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ListElement = (labelValue, selectedPerson) => {
  const optionValues = selectedPerson ? selectedPerson.split(',') : [];

  return (
    <Form.Group as={Row} className="mb-2" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Form.Label column sm="2">
        {labelValue}
      </Form.Label>
      <Col sm="10">
        <Form.Select className="form-select">
          {optionValues.map((optionValue) => (
            <option
              key={optionValue.toLowerCase().replace(/\s+/g, '-')}
              value={optionValue.toLowerCase().replace(/\s+/g, '-')}
            >
              {optionValue}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
};

export default ListElement;
