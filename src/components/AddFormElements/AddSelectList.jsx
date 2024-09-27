import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  faList,
  faMinusSquare,
  faArrowsUpDown,
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * AddSelectList component renders a form for adding and managing a list of selectable items.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.itemKey - The key for the item.
 * @param {Array} [props.items=[]] - The list of items.
 * @param {string} [props.label=''] - The label for the select list.
 * @param {Function} props.onRemove - Function to call when removing the select list.
 * @param {Function} props.onRemoveItem - Function to call when removing an item from the list.
 * @param {Function} props.onChange - Function to call when the label or required checkbox changes.
 * @param {Function} props.addItem - Function to call when adding a new item to the list.
 * @param {Function} props.onItemLabelChange - Function to call when an item label changes.
 * @param {boolean} props.isRequired - Indicates if the select list is required.
 * @param {Object} props.attributes - Attributes for the draggable button.
 * @param {Object} props.listeners - Event listeners for the draggable button.
 * @returns {JSX.Element} The rendered AddSelectList component.
 */
function AddSelectList({
  itemKey,
  items = [],
  label = '',
  onRemove,
  onRemoveItem,
  onChange,
  addItem,
  onItemLabelChange,
  isRequired,
  attributes,
  listeners
}) {
  return (
    <div className="d-flex justify-content-center align-items-center position-relative">
      <div className="px-5 mt-2 mb-2 element-container" style={{ flexGrow: 1 }}>
        <Row className="align-items-center">
          <Col
            xs="auto"
            className="d-flex justify-content-center align-items-center"
            style={{ minWidth: '120px' }}>
            <FontAwesomeIcon icon={faList} />
            <span className="ms-2">Select List</span>
          </Col>
          <Col className="d-flex flex-column">
            <Form.Group className="flex-grow-1">
              <Form.Label htmlFor="freeform-label">Enter Selectlist Label</Form.Label>
              <Form.Control
                type="text"
                className="selectlist-label form-control element-name"
                placeholder="E.g. Select your favorite color"
                value={label}
                onChange={onChange}
                isInvalid={!label.trim()}
                style={{ marginTop: '20px' }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Selectlist title is required
              </Form.Control.Feedback>

              <div className="d-flex flex-column mt-3">
                {items.map((item, index) => (
                  <div key={index} className="select-list-item d-flex align-items-center mb-3">
                    <Form.Control
                      type="text"
                      className="form-control select-item-input selectlist-item me-2"
                      placeholder="E.g. Item 1"
                      value={item}
                      onChange={(event) => onItemLabelChange(itemKey, index, event)}
                      isInvalid={!item.trim()}
                      required
                      style={{ width: '200px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Selectlist item is required
                    </Form.Control.Feedback>
                    <Button
                      className="btn btn-danger remove-selectlist-item"
                      data-testid="remove-selectlist-item"
                      onClick={() => onRemoveItem(itemKey, index)}
                      style={{
                        background: 'none',
                        color: 'red',
                        border: 'none'
                      }}>
                      <FontAwesomeIcon icon={faMinusSquare} size="lg" />
                    </Button>
                  </div>
                ))}
                <Button
                  className="add-selectlist-item btn btn-secondary mt-2"
                  data-testid="add-selectlist-item"
                  onClick={addItem}
                  style={{ background: 'none', color: 'black', border: 'none' }}>
                  <FontAwesomeIcon icon={faPlusSquare} size="lg" />
                </Button>
              </div>
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
        overlay={<Tooltip id="tooltip-add-checkbox">Remove Select List</Tooltip>}>
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
        overlay={<Tooltip id="tooltip-add-checkbox">Move Select List</Tooltip>}>
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

AddSelectList.propTypes = {
  itemKey: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  onItemLabelChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  attributes: PropTypes.object.isRequired,
  listeners: PropTypes.object.isRequired
};

export default AddSelectList;
