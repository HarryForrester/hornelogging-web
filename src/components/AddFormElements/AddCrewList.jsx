import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddCrewList({ label, value, onChange, onRemove }) {
  const title = value === 'All' ? 'All' : value;

  return (
    <div className="mb-2">
      <div className="d-flex align-items-center mb-2 px-3 element-container">
        <Form.Label className="elementLabel" style={{ fontWeight: 'normal' }}>
          <FontAwesomeIcon icon={faRectangleList} />
          <span className="span-text-element"> {title} List</span>
        </Form.Label>
        <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
          <Form.Control
            type="text"
            className="crewselectlist-label form-control element-name"
            placeholder="Enter Label"
            value={label}
            onChange={onChange}
            isInvalid={!label.trim()}
            required
          />
          <Form.Control.Feedback type="invalid">Crew List title is required</Form.Control.Feedback>
        </div>
        <Button variant="danger" className="remove-freeform-btn ms-2" onClick={onRemove}>
          <FontAwesomeIcon icon={faMinusCircle} />
        </Button>
      </div>
    </div>
  );
}

AddCrewList.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default AddCrewList;
