import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const HazardReviewModal = ({ show, onHide, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the comment to the parent component for further processing
    onSubmit(comment);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="reviewModalLabel">Review Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Review comment</b>
            </Form.Label>
            <Form.Control
              type="text"
              id="comment"
              name="comment"
              value={comment}
              onChange={handleCommentChange}
              required
            />
            <Form.Control type="hidden" id="updateRecords" name="records" />
          </Form.Group>
          <Button variant="primary" type="submit" block>
            Update Review
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

HazardReviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default HazardReviewModal;
