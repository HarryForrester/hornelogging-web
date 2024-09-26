import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

function AddCheckbox({ labelValue, onChange, onRemove }) {
  return (
    <div className="mb-3 px-3 element-container position-relative" style={{ paddingTop: '1.5rem' }}>
      <Button
        className="remove-check-btn btn btn-danger position-absolute"
        onClick={onRemove}
        style={{ top: '0.5rem', right: '0.5rem', background: 'none', color: 'red', border: 'none' }}
      >
        <FontAwesomeIcon size="lg" icon={faMinusSquare} />
      </Button>
      <Row className="align-items-center">
        <Col xs="auto" className="d-flex align-items-center" style={{minWidth: '120px'}}>
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
  );
}

AddCheckbox.propTypes = {
  labelValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default AddCheckbox;