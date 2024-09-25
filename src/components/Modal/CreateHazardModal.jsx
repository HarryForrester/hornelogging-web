import React from 'react';
import { Modal, Button, Col, Row, Form, Spinner } from 'react-bootstrap';
import { Formik, ErrorMessage, FieldArray, Field } from 'formik';

import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';
const CreateHazardModal = ({ show, handleClose, initialValues, isEditing, updateHazards }) => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const { addToast } = useAlertMessage();
  /**
   * Handles the submission of adding/editing a hazard
   * @param {*} e
   */
  const submit = async (values, resetForm) => {
   
    try {
      setShowSpinner(true);
      console.log('handleSubmit', values)
       var response;
      if (isEditing) {
        // eslint-disable-next-line no-undef
        response = await axios.post(process.env.REACT_APP_URL + '/hazardedit', values, {
          withCredentials: true
        });
      } else {
        // eslint-disable-next-line no-undef
        response = await axios.post(process.env.REACT_APP_URL + '/hazardcreate', values, {
          withCredentials: true
        });
      }

      if (response.status === 200) {
        updateHazards(response.data.hazards);
        resetForm();
        handleClose();

        if (isEditing) {
          addToast(
            `Hazard Updated`,
            `Success! ${values.title} has been updated`,
            'success',
            'white'
          );
        } else {
          addToast(
            'Hazard Added',
            `Success! ${values.title} has beeen added`,
            'success',
            'white'
          );
        }
      } 
    } catch (error) {
      addToast(
        'Add Hazard',
        `Error! An Error has occurred adding editing or adding ${values.title} hazard`,
        'danger',
        'white'
      );
    } finally {
      setShowSpinner(false);
    } 
  };
  const defaultInitialValues = {
    title: '',
    sev: 'LOW',
    reviewDate: '',
    reviewReason: '',
    category: 'Health',
    harmFields: [{ category: '', description: [''] }]
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    sev: Yup.string().required('Severity is required'),
    reviewDate: Yup.date().required('Review Date is required'),
    reviewReason: Yup.string().required('Review Reason is required'),
    category: Yup.string().required('Category is required'),
    harmFields: Yup.array().of(
      Yup.object({
        category: Yup.string().required('Category is required'),
        description: Yup.array().of(Yup.string().required('Description is required'))
      })
    )
  });

  return (
    <Formik
      enableReinitialize
      initialValues={isEditing ? initialValues : defaultInitialValues}
      //validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        submit(values, resetForm);
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title id="createModalLabel">{isEditing ? 'Edit' : 'Add'} Hazard</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Col} controlId="newHazardTitle">
                <Form.Label>Hazard Title</Form.Label>
                <Field
                  type="text"
                  name="title"
                  placeholder="E.g. Early over-exertion"
                  className="form-control"
                />
                <ErrorMessage name="title" component="div" className="error" />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group as={Col} controlId="newHazardSev">
                    <Form.Label>Severity</Form.Label>
                    <Field as="select" name="sev" className="form-select">
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </Field>
                    <ErrorMessage name="sev" component="div" className="error" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="newHazardCat" className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Field as="select" name="category" className="form-select">
                      <option value="Health">Health</option>
                      <option value="Generic">Generic</option>
                      <option value="Environmental">Environmental</option>
                      <option value="HazardousSubstances">Hazardous Substances</option>
                      <option value="Fire">Fire</option>
                      <option value="ChainsawUse">Chainsaw Use</option>
                      <option value="TreeFelling(Manual)">Tree Felling (Manual)</option>
                      <option value="TreeFelling(Mechanical)">Tree Felling (Mechanical)</option>
                      <option value="BreakingOut">Breaking Out</option>
                      <option value="Machine Ops">Machine Ops</option>
                      <option value="MachinesinCutover">Machines in Cutover</option>
                      <option value="RiggingSupport">Rigging Support</option>
                      <option value="Poleman">Poleman</option>
                      <option value="Skidwork">Skid work</option>
                      <option value="MechanicalProcessingonSkid">Mechanical Processing on Skid</option>
                      <option value="Loading">Loading</option>
                      <option value="Office">Office</option>
                      <option value="Workshop">Workshop</option>
                      <option value="TetherSteepSlopeHarvesting">Tether Steep Slope Harvesting</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="error" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="newHazardReviewDate" className="mb-3">
                <Form.Label>Review Date</Form.Label>
                <Field type="date" name="reviewDate" className="form-control" />
                <ErrorMessage name="reviewDate" component="div" className="error" />
              </Form.Group>
              <Form.Group controlId="newHazardReviewReason" className="mb-3">
                <Form.Label>Review Reason</Form.Label>
                <Field
                  type="text"
                  name="reviewReason"
                  placeholder="E.g. General Review"
                  className="form-control"
                />
                <ErrorMessage name="reviewReason" component="div" className="error" />
              </Form.Group>
              <FieldArray name="harmFields">
                {({ push, remove }) => (
                  <>
                    {values.harmFields.map((harm, harmIndex) => (
                      <div
                        key={harmIndex}
                        style={{
                          border: '1px solid #000',
                          borderRadius: '5px',
                          padding: '15px',
                          marginBottom: '10px',
                          position: 'relative'
                        }}
                      >
                        <Button
                          variant="danger"
                          onClick={() => remove(harmIndex)}
                          style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            background: 'none',
                            border: 'none'
                          }}
                        >
                          <FontAwesomeIcon color="red" size="lg" icon={faCircleMinus} />
                        </Button>
                        <Row className="harm-row">
                          <Col md={5}>
                            <Field
                              name={`harmFields.${harmIndex}.category`}
                              placeholder="Category (E.g. Fire)"
                              className="form-control mb-2"
                            />
                            <ErrorMessage
                              name={`harmFields.${harmIndex}.category`}
                              component="div"
                              className="error"
                            />
                          </Col>
                          <Col md={12}>
                            <FieldArray name={`harmFields.${harmIndex}.description`}>
                              {({ push: pushDesc, remove: removeDesc }) => (
                                <>
                                  {harm.description.map((desc, descIndex) => (
                                    <div
                                      key={descIndex}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'stretch',
                                        gap: '10px',
                                        marginBottom: '10px'
                                      }}
                                    >
                                      <Field
                                        name={`harmFields.${harmIndex}.description.${descIndex}`}
                                        as="textarea"
                                        rows={1}
                                        className="form-control mb-2"
                                        placeholder="Description (E.g. Do not light fires)"
                                        style={{ flex: '1', borderRadius: '5px' }}
                                      />
                                      <ErrorMessage
                                        name={`harmFields.${harmIndex}.description.${descIndex}`}
                                        component="div"
                                        className="error"
                                      />
                                      {descIndex !== 0 && (
                                        <Button
                                          onClick={() => removeDesc(descIndex)}
                                          style={{
                                            flex: 'none',
                                            alignSelf: 'stretch',
                                            borderRadius: '5px',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            height: '100%',
                                            background: 'none'
                                          }}
                                        >
                                          <FontAwesomeIcon color="red" size="lg" icon={faCircleMinus} />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    onClick={() => pushDesc('')}
                                    style={{ background: 'none', border: 'none' }}
                                  >
                                    <FontAwesomeIcon color="blue" size="lg" icon={faCirclePlus} />
                                  </Button>
                                </>
                              )}
                            </FieldArray>
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="primary"
                      className="mt-2"
                      onClick={() => push({ category: '', description: [''] })}
                    >
                      Add Harm
                    </Button>
                  </>
                )}
              </FieldArray>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="secondary" onClick={handleSubmit}>
              {showSpinner ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : (
                'Save changes'
              )}
            </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

CreateHazardModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isEditing: PropTypes.bool,
  updateHazards: PropTypes.func.isRequired
};

export default CreateHazardModal;