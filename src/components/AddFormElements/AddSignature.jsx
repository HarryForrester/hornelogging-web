import React from 'react';
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddSignature({ labelValue, isChecked, onChange, onRemove, isDisabled }) {
  return (
    <div className="d-flex align-items-center mb-2 px-3 element-container">
      <label className="elementLabel">
      <FontAwesomeIcon icon={faSignature} />        
      <span className='span-text-element'> Signature</span>
      </label>
      <Form.Control
        type="text"
        className="check-item form-control element-name"
        placeholder="Signature Element"
        value={labelValue}
        onChange={onChange}
      />
      <Button className="remove-check-btn btn btn-danger ms-2" onClick={onRemove} style={{background: 'none', color:'red', border: 'none'}}>
      <FontAwesomeIcon size='lg' icon={faMinusCircle} />        

      </Button>
    </div>
  );
}

export default AddSignature;
