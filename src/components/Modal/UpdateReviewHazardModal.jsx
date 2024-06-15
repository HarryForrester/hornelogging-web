import React, { useState } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import { useHazardState } from '../HazardContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import Feedback from 'react-bootstrap/esm/Feedback';
import PropTypes from 'prop-types';

const UpdateReviewHazardModal = ({ submit }) => {
  const { hazardState, setHazardState } = useHazardState();

  const [comment, setComment] = useState(null);
  const [commentIsValid, setCommentIsValid] = useState(null);

  const resetForm = () => {
    setComment(null);
    setCommentIsValid(null);
  };

  const handleSubmit = () => {
    if (!comment) {
      setCommentIsValid(false);
    }
    //console.log("submit: ", comment);
    //resetForm();
    submit(comment);
  };

  const handleClose = () => {
    setHazardState((prevState) => ({
      ...prevState,
      isUpdateReviewModalVisible: false,
      reviewDate: null,
      reviewReason: null
    }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setCommentIsValid(e ? true : null);
  };

  return (
    <Modal show={hazardState.isUpdateReviewModalVisible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title id="updateReviewHazardLabel">Update Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="updateReviewHazardForm" onSubmit={handleSubmit}>
          <Form.Label>Review comment</Form.Label>
          <Form.Control
            type="text"
            id="comment"
            name="comment"
            onChange={(e) => handleCommentChange(e)}
            isValid={commentIsValid === true}
            isInvalid={commentIsValid === false}
            required
          />
          {commentIsValid === false && (
            <Feedback type="invalid">Please provide a valid comment</Feedback>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Update Reivew</Button>
      </Modal.Footer>
    </Modal>
  );
};

UpdateReviewHazardModal.propTypes = {
  submit: PropTypes.func.isRequired
};

export default UpdateReviewHazardModal;
