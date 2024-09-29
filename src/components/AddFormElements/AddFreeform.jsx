import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

function AddFreeform({ labelValue, isRequired, onChange, onRemove, attributes, listeners }) {
  console.log('AddFreeform', isRequired);
  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col
            xs="auto"
            className="d-flex justify-content-center align-items-center"
            style={{ minWidth: '120px' }}>
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
                placeholder="E.g. Enter your name"
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

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-add-checkbox">Remove Text</Tooltip>}>
        <Button
          className="remove-check-btn btn btn-danger"
          onClick={onRemove}
          data-testid="remove-freeform"
          style={{
            padding: '5px',
            color: 'white',
            border: 'none',
            borderRadius: '0px 3px 3px 0px',
            position: 'absolute',
            top: '0',
            right: '0',
            height: '100%'
          }}>
          <FontAwesomeIcon icon={faMinusSquare} />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-add-checkbox">Move Text</Tooltip>}>
        <button
          style={{
            cursor: 'move',
            padding: '5px',
            color: 'white',
            border: 'none',
            borderRadius: '3px 0px 0px 3px',
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%'
          }}
          {...attributes}
          {...listeners}>
          <FontAwesomeIcon icon={faArrowsUpDown} style={{ color: '#242424' }} />
        </button>
      </OverlayTrigger>
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
