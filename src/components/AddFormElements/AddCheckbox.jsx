import React from 'react';
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddCheckbox({ label, onChange, onRemove, isDisabled }) {
  return (
    <div className="d-flex align-items-center mb-2 px-3 element-container">
      <label className="elementLabel">
      <FontAwesomeIcon icon={faSquareCheck} />        
      <span className='span-text-element'> Check</span>
      </label>
      <Form.Control
        type="text"
        className="check-item form-control element-name"
        placeholder="Enter Check Name"
        value={label}
        onChange={onChange}
      />
      <Button className="remove-check-btn btn btn-danger ms-2" onClick={onRemove} style={{background: 'none', color:'red', border: 'none'}}>
      <FontAwesomeIcon size='lg' icon={faMinusCircle} />        

      </Button>
    </div>
  );
}

export default AddCheckbox;
