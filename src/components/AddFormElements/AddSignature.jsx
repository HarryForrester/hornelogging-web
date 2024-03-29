import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function AddSignature({ labelValue, isChecked, onChange, onRemove, isDisabled }) {
  return (
    <div
      className="d-flex align-items-center mb-2 px-3 element-container"
      style={{ marginTop: '10px' }}
    >
      <label className="elementLabel">
        <FontAwesomeIcon icon={faSignature} />
        <span className="span-text-element"> Signature</span>
      </label>
      <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
        <Form.Control
          type="text"
          className="check-item form-control element-name"
          placeholder="Signature Element"
          value={labelValue}
          onChange={onChange}
          isInvalid={!labelValue.trim()}
          required
        />
        <Form.Control.Feedback type="invalid">Signature title is required</Form.Control.Feedback>
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

AddSignature.propTypes = {
  labelValue: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default AddSignature;
