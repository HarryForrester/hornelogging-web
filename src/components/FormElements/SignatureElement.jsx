import React from 'react';
import { Form, Image } from 'react-bootstrap';

const SignatureElement = (labelValue, signature) => {
  return (
    <Form.Group className="mb-2" style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Form.Label className="form-label">{labelValue}</Form.Label>
      <Image src={signature} style={{ maxWidth: '200px', maxHeight: '200px' }} fluid />
    </Form.Group>
  );
};

export default SignatureElement;
