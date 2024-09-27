import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

/**
 * AddDate component renders a form element for adding a date input with customizable label and required checkbox.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.labelValue - The value of the date label input.
 * @param {function} props.onChange - The function to call when the input value changes.
 * @param {function} props.onRemove - The function to call when the remove button is clicked.
 * @param {boolean} props.isRequired - Indicates whether the date input is required.
 * @param {Object} props.attributes - Additional attributes for the draggable button.
 * @param {Object} props.listeners - Event listeners for the draggable button.
 * @returns {JSX.Element} The rendered AddDate component.
 */
function AddDate({ labelValue, onChange, onRemove, isRequired, attributes, listeners }) {
  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col
            xs="auto"
            className="d-flex justify-content-center align-items-center"
            style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faCalendar} />
            <span className="ms-2">Date</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label htmlFor="freeform-label">Enter Date Label</Form.Label>
              <Form.Control
                type="text"
                className="check-item form-control element-name"
                placeholder="E.g. Enter your birthdate"
                value={labelValue}
                onChange={onChange}
                isInvalid={!labelValue.trim()}
                required
              />
              <Form.Control.Feedback type="invalid">Date title is required</Form.Control.Feedback>
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
                aria-labelledby='required-checkbox'

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
          padding: '10px',
          color: 'white',
          border: 'none',
          borderRadius: '0px 3px 3px 0px',
          position: 'absolute',
          top: '0',
          right: '0',
          height: '100%'
        }}>
        <FontAwesomeIcon size="xl" icon={faMinusSquare} />
      </Button>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-add-checkbox">Move Date</Tooltip>}>
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

AddDate.propTypes = {
  labelValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  attributes: PropTypes.object,
  listeners: PropTypes.object
};

export default AddDate;
