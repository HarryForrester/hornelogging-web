/**
 * NOT IN USE!!
 */

/* import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAlertMessage } from '../AlertMessage';

const UpdateReviewHazardModal = ({ show, onHide, selectedHazardIds, hazards, setHazards }) => {
  const { addToast } = useAlertMessage();

  const initialValues = {
    comment: ''
  };

  const validationSchema = Yup.object({
    comment: Yup.string().required('Please provide a valid comment')
  });

  const handleUpateReviewSubmit = async (values, { setSubmitting }) => {
    const hazardObj = {
      _ids: selectedHazardIds,
      comment: values.comment
    };

    try {
      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/hazardreview', hazardObj, {
        withCredentials: true
      });
      let message;

      if (response.status === 200) {
        if (selectedHazardIds.length === 1) {
          const hazardObj = hazards.find((hazard) => hazard._id === selectedHazardIds[0]);
          message = `Success! ${hazardObj.title} review comment has been updated`;
        } else {
          message = `Success! multiple hazard review comments have been updated`;
        }
        addToast('Hazard Review Updated', message, 'success', 'white');
        setHazards(response.data.hazards);
        onHide();
      }
    } catch (error) {
      addToast(
        'Add Person',
        `Error! An error has occurred while updating hazard review`,
        'danger',
        'white'
      );
      console.error('Error updating review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="updateReviewHazardLabel">Update Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUpateReviewSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form id="updateReviewHazardForm" onSubmit={handleSubmit}>
              <Form.Group controlId="comment">
                <Form.Label>Review comment</Form.Label>
                <Field
                  type="text"
                  name="comment"
                  className="form-control"
                  placeholder="Enter your comment"
                />
                <ErrorMessage name="comment" component="div" className="invalid-feedback" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Update Review
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

UpdateReviewHazardModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  selectedHazardIds: PropTypes.array.isRequired,
  hazards: PropTypes.array.isRequired,
  setHazards: PropTypes.func.isRequired
};

export default UpdateReviewHazardModal; */