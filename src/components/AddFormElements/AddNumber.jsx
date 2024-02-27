import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fa8, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddNumber({labelValue, itemValue, onChange, onRemove}) {
  return (
    <div className="d-flex align-items-center mb-2 px-3 element-container">
      <label className="elementLabel">
      <FontAwesomeIcon icon={fa8} />        
      <span className='span-text-element'> Number</span>
      </label>
      <Form.Control
        type="text"
        className="check-item form-control element-name"
        placeholder="Number Element"
        value={labelValue}
        onChange={onChange}
      />
      <Button className="remove-check-btn btn btn-danger ms-2" onClick={onRemove} style={{background: 'none', color:'red', border: 'none'}}>
      <FontAwesomeIcon size='lg' icon={faMinusCircle} />        

      </Button>
    </div>
  );
}

export default AddNumber
