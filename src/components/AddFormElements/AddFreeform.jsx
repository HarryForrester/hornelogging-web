import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

function AddFreeform({ labelValue, isRequired, onChange, onRemove, attributes, listeners }) {
  return (
    <div className="d-flex justify-content-between align-items-start position-relative">
      <div
        className="mb-3 px-3 element-container"
        style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col xs="auto" className="d-flex align-items-center" style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faFont} />
            <span className="ms-2">Text</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label htmlFor="freeform-label">Enter Text Label</Form.Label>
              <Form.Control
                id="freeform-label"
                type="text"
                className="check-item form-control element-name"
                placeholder="Freeform Element"
                value={labelValue}
                onChange={onChange}
                isInvalid={!labelValue.trim()}
                required
              />
              <Form.Control.Feedback type="invalid">
                Freeform title is required
              </Form.Control.Feedback>
            </Form.Group>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="checkbox-tooltip">Check this box to make the input required</Tooltip>
              }>
              <Form.Check
                type="checkbox"
                label="Required"
                checked={isRequired}
                onChange={onChange}
                className="mt-2"
              />
            </OverlayTrigger>
          </Col>
        </Row>
      </div>

      <Button
        className="remove-check-btn btn btn-danger"
        onClick={onRemove}
        data-testid="remove-freeform"
        style={{
          background: 'none',
          color: 'red',
          border: 'none',
        }}>
        <FontAwesomeIcon size="xl" icon={faMinusSquare} />
      </Button>

      <button
        style={{
          cursor: 'move',
          padding: '10px',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          display: 'flex',
          position: 'absolute',
          top: '0',
          left: '0',
        }}
        {...attributes}
        {...listeners}>
        <FontAwesomeIcon icon={faArrowsUpDown} style={{ color: '#242424' }} />
      </button>
    </div>
  );
}

AddFreeform.propTypes = {
  labelValue: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  listeners: PropTypes.object
};

export default AddFreeform;