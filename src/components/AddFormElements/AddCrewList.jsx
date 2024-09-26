import React from 'react';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faMinusSquare, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

/**
 * AddCrewList component renders a form element for adding a crew list with a label and required checkbox.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the crew list.
 * @param {string} props.value - The value of the crew list, used to determine the title.
 * @param {function} props.onChange - The function to call when the label or required checkbox changes.
 * @param {function} props.onRemove - The function to call when the remove button is clicked.
 * @param {boolean} props.isRequired - Indicates if the crew list is required.
 * @param {Object} props.attributes - Attributes for the draggable button.
 * @param {Object} props.listeners - Event listeners for the draggable button.
 * @returns {JSX.Element} The rendered AddCrewList component.
 */
function AddCrewList({ label, value, onChange, onRemove, isRequired, attributes, listeners }) {
  const title = value === 'All' ? 'All' : value;

  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col
            xs="auto"
            className="d-flex justify-content-center align-items-center"
            style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faRectangleList} />
            <span className="ms-2">{title} List</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label htmlFor="freeform-label">Enter {title} List Label</Form.Label>
              <Form.Control
                type="text"
                className="crewselectlist-label form-control element-name"
                placeholder="E.g. Select a employee from the crew list"
                value={label}
                onChange={onChange}
                isInvalid={!label.trim()}
                required
              />
              <Form.Control.Feedback type="invalid">
                Crew List title is required
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
                aria-labelledby="required-checkbox"
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
    </div>
  );
}

AddCrewList.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  attributes: PropTypes.object,
  listeners: PropTypes.object
};

export default AddCrewList;
