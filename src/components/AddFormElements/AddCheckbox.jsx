import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

/**
 * AddCheckbox component renders a form element for adding a checkbox with a label.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.labelValue - The value of the checkbox label.
 * @param {function} props.onChange - The function to call when the label value changes.
 * @param {function} props.onRemove - The function to call when the remove button is clicked.
 * @param {Object} props.attributes - The attributes to be spread onto the move button.
 * @param {Object} props.listeners - The event listeners to be spread onto the move button.
 * @returns {JSX.Element} The rendered AddCheckbox component.
 */
function AddCheckbox({ labelValue, onChange, onRemove, attributes, listeners }) {
  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col xs="auto" className="d-flex justify-content-center align-items-center" style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faSquareCheck} />
            <span className="ms-2">Checkbox</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label>Enter Check Label</Form.Label>
              <Form.Control
                type="text"
                className="check-item form-control element-name"
                placeholder="E.g. I have read and understood the above"
                value={labelValue}
                onChange={onChange}
                isInvalid={!labelValue}
                required
              />
              <Form.Control.Feedback type="invalid">
                Checkbox title is required
              </Form.Control.Feedback>
            </Form.Group>
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
          height: '100%',
        }}>
        <FontAwesomeIcon size="xl" icon={faMinusSquare} />
      </Button>

      <button
      data-testid="move-button"
        style={{
          cursor: 'move',
          padding: '5px',
          color: 'white',
          border: 'none',
          borderRadius: '3px 0px 0px 3px',
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
        }}
        {...attributes}
        {...listeners}>
        <FontAwesomeIcon icon={faArrowsUpDown} style={{ color: '#242424' }} />
      </button>
    </div>
  );
}

AddCheckbox.propTypes = {
  labelValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  listeners: PropTypes.object
};

export default AddCheckbox;
