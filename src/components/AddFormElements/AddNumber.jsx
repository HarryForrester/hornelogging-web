import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fa8, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddNumber({ labelValue, itemValue, onChange, onRemove }) {
  return (
    <div
      className="d-flex align-items-center mb-2 px-3 element-container"
      style={{ marginTop: '10px' }}
    >
      <label className="elementLabel">
        <FontAwesomeIcon icon={fa8} />
        <span className="span-text-element"> Number</span>
      </label>
      <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
        <Form.Control
          type="text"
          className="check-item form-control element-name"
          placeholder="Number Element"
          value={labelValue}
          onChange={onChange}
          isInvalid={!labelValue.trim()}
          required
        />
        <Form.Control.Feedback type="invalid">Number title is required</Form.Control.Feedback>
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

AddNumber.propTypes = {
  labelValue: PropTypes.string.isRequired,
  itemValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default AddNumber;
