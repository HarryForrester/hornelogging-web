import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const HazardReviewModal = ({ show, onHide, selectedHazardsId, hazards, setHazards }) => {
  const { addToast } = useAlertMessage();

  const initialValues = {
    comment: ''
  };

  const validationSchema = Yup.object({
    comment: Yup.string().required('Please provide a valid comment')
  });

  /**
   * Handles the submission of hazard review updates
   * @param {string} comment - The review comment given by user
   **/

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const hazardObj = {
      _ids: selectedHazardsId,
      comment: values.comment
    };

    try {
      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/hazardreview', hazardObj, {
        withCredentials: true
      });
      let message;

      if (response.status === 200) {
        if (selectedHazardsId.length === 1) {
          const hazardObj = hazards.find((hazard) => hazard._id === selectedHazardsId[0]);
          message = `Success! ${hazardObj.title} review comment has been updated`;
        } else {
          message = `Success! multiple hazard review comments have been updated`;
        }
        addToast('Hazard Review Updated', message, 'success', 'white');
        setHazards(response.data.hazards);
        setSubmitting(false);
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
        <Modal.Title id="reviewModalLabel">Review Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({ handleSubmit, isSubmitting, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Review comment</b>
                </Form.Label>
                <Field
                  type="text"
                  name="comment"
                  className={`form-control ${touched.comment && errors.comment ? 'is-invalid' : ''}`}
                  placeholder="Enter your comment"
                />
                <ErrorMessage name="comment" component="div" className="invalid-feedback" />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Update Review
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

HazardReviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  selectedHazardsId: PropTypes.array.isRequired,
  hazards: PropTypes.array.isRequired,
  setHazards: PropTypes.func.isRequired
};

export default HazardReviewModal;
