import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddCrewList({ label,value, crew, onChange, onRemove }) {
  const title = crew === 'All' ? 'All' : crew;

  return (
    <div className="mb-2">
      <div className="d-flex align-items-center mb-2 px-3 element-container">
        <Form.Label className="elementLabel">
          <FontAwesomeIcon icon={faRectangleList} />
          <span className='span-text-element'>{title} List</span>
        </Form.Label>
        <Form.Control
          type="text"
          className="crewselectlist-label form-control element-name"
          placeholder="Enter Label"
          value={label}
          onChange={onChange}
        />
        <Button variant="danger" className="remove-freeform-btn ms-2" onClick={onRemove}>
          <FontAwesomeIcon icon={faMinusCircle} />
        </Button>
      </div>
    </div>
  );
}

export default AddCrewList;
