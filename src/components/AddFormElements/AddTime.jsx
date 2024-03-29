import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddTime({ labelValue, itemValue, onChange, onRemove }) {
  return (
    <div
      className="d-flex align-items-center mb-2 px-3 element-container"
      style={{ marginTop: '10px' }}
    >
      <label className="elementLabel">
        <FontAwesomeIcon icon={faClock} />
        <span className="span-text-element"> Time</span>
      </label>
      <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
        {' '}
        {/* Use Bootstrap flex-grow-1 class to make the input fill the remaining space */}
        <Form.Control
          type="text"
          className="check-item form-control element-name"
          placeholder="Time Element"
          value={labelValue}
          onChange={onChange}
          isInvalid={!labelValue.trim()}
          required
        />
        <Form.Control.Feedback type="invalid">Time title is required</Form.Control.Feedback>
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

AddTime.propTypes = {
  labelValue: PropTypes.string.isRequired,
  itemValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default AddTime;
