import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

function AddTime({ labelValue, itemValue, onChange, onRemove, isRequired, attributes, listeners }) {
  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col
            xs="auto"
            className="d-flex justify-content-center align-items-center"
            style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faClock} />
            <span className="ms-2">Time</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label htmlFor="freeform-label">Enter Time Label</Form.Label>
              <Form.Control
                type="text"
                className="check-item form-control element-name"
                placeholder="E.g. Enter the time you woke up"
                value={labelValue}
                onChange={onChange}
                isInvalid={!labelValue.trim()}
                required
              />
              <Form.Control.Feedback type="invalid">Time title is required</Form.Control.Feedback>
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
                aria-labelledby="required-checkbox"
              />
            </OverlayTrigger>
          </Col>
        </Row>
      </div>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-add-checkbox">Remove Time</Tooltip>}>
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
        overlay={<Tooltip id="tooltip-add-checkbox">Move Time</Tooltip>}>
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

AddTime.propTypes = {
  labelValue: PropTypes.string.isRequired,
  itemValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  attributes: PropTypes.object,
  listeners: PropTypes.object
};

export default AddTime;
