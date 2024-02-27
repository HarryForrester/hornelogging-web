import React from 'react';
import { Form, Image } from 'react-bootstrap';

const ImageElement = ({ labelValue, image }) => {
  return (
    <Form.Group className="mb-2" style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Form.Label className="form-label">{labelValue}</Form.Label>
      <Image src={`data:image/jpeg;base64,${image}`} fluid />
    </Form.Group>
  );
};

export default ImageElement;
