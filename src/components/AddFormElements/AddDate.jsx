import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddDate({labelValue, itemValue, onChange, onRemove}) {
  return (
    <div className="d-flex align-items-center mb-2 px-3 element-container">
      <label className="elementLabel">
      <FontAwesomeIcon icon={faCalendar} />        
      <span className='span-text-element'> Date</span>
      </label>
      <Form.Control
        type="text"
        className="check-item form-control element-name"
        placeholder="Date Element"
        value={labelValue}
        onChange={onChange}
      />
      <Button className="remove-check-btn btn btn-danger ms-2" onClick={onRemove} style={{background: 'none', color:'red', border: 'none'}}>
      <FontAwesomeIcon size='lg' icon={faMinusCircle} />        

      </Button>
    </div>
  );
}

export default AddDate;
