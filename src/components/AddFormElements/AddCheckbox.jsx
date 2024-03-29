import React from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddCheckbox({ labelValue, onChange, onRemove, isDisabled }) {
  return (
    <div
      className="d-flex align-items-center mb-3 px-3 element-container"
      style={{ marginTop: '10px' }}
    >
      <label className="elementLabel">
        <FontAwesomeIcon icon={faSquareCheck} />
        <span className="span-text-element"> Check</span>
      </label>
      <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
        {' '}
        {/* Use Bootstrap flex-grow-1 class to make the input fill the remaining space */}
        <Form.Control
          type="text"
          className="check-item form-control element-name"
          placeholder="Enter Check Name"
          value={labelValue}
          onChange={onChange}
          isInvalid={!labelValue}
          required
        />
        <Form.Control.Feedback type="invalid">Checkbox title is required</Form.Control.Feedback>
      </div>
      <Button
        className="remove-check-btn btn btn-danger ms-2"
        onClick={onRemove}
        style={{ background: 'none', color: 'red', border: 'none' }}
      >
        <FontAwesomeIcon size="lg" icon={faMinusCircle} />
      </Button>
    </div>
  );
}

AddCheckbox.propTypes = {
  labelValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default AddCheckbox;
