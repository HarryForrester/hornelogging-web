/* eslint-disable no-undef */
import React, { useState, useRef } from 'react';
import SelectRoleType from '../SelectList/SelectRoleType';
import InputWithLabel from '../Input/InputWithLabel';
import InputWithLabelMulti from '../Input/InputWithLabelMulti';
import axios from 'axios';
import { Button, Form, Image, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl } from '../../hooks/useFileUpload';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { subYears } from 'date-fns'; // To calculate age based on current date

/**
 * Renders a modal for adding or editing a person's information.
 * 
 * @param {Object} _account - The account details, the companys account id.
 * @param {Object|null} person - The person object to be edited. If null, the modal is in "add" mode.
 * @param {Function} updatePerson - Callback to update the person data in the parent component after successful add/edit.
 * @param {boolean} show - Controls the visibility of the modal.
 * @param {Function} hideModal - Callback to close the modal.
 * @param {Array} crews - List of crew objects to populate crew selection in the form.
 * @param {string} title - Title for the modal, e.g., "Add Person" or "Edit Person".
 * @param {boolean} edit - Flag indicating if the modal is in edit mode (true) or add mode (false).
 * 
 * @returns {JSX.Element} - A modal component that allows users to add or edit person details.
 */
const AddOrEditPersonModal = ({_account, person, updatePerson, show, hideModal, crews, title, edit}) => {
  const { addToast } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const phoneRegExp = /^(\+64|0)[2-9]\d{7,9}$/;
  const initialValues = {
    id: person?._id || '',
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    crew: person?.crew || '',
    role: person?.role || '',
    phone: person?.phone || '',
    email: person?.email || '',
    address: person?.address || '',
    dob: person?.dob || '',
    startDate: person?.startDate || '',
    contact: person?.contact || '',
    contactphone: person?.contactphone || '',
    doctor: person?.doctor || '',
    medical: person?.medical || '',
    imgPreview: person?.imgPreview || '',
    archive: person?.archive || false
  }

  const fileInputRef = useRef(null);
  const formikRef = useRef(null);

  // Clear file input
  const handleClose = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
    if (formikRef.current) {
      formikRef.current.resetForm(); // Reset Formik form values
    }
    hideModal();
  };

  const handleSubmit = async (values) => {
    setShowSpinner(true);
  
    try {
      if (edit) {
        // Editing an existing person
        let response;
        // if an profile image is uploaded
        if (values.imgFile) {
          // Upload new image and update with imgUrl
          const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${values.id}`, 'image/png');
          await uploadToPresignedUrl(presignedUrl, values.imgFile, 'image/png');
          const filePath = getFilePathFromUrl(presignedUrl);
  
          values.imgUrl = { key: key, url: filePath }; // Add new imgUrl to the updated form state
        } else {
          // If no new image is uploaded, remove imgPreview from the submission
          delete values.imgPreview;
        }
  
        response = await axios.post(
          `${process.env.REACT_APP_URL}/update-person/${values.id}`,
          values,
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          // Delete old profile image if it exists and a new one was uploaded
          if (values.imgFile && person.imgUrl) {
            await deletePresignedUrl([person.imgUrl.key]);
          }
  
          addToast('Person Updated!', `Success! ${values.firstName} ${values.lastName} has been updated`, 'success', 'white');
          updatePerson(response.data.updatedPerson); // Update person data in UI
         // hideModal(); // Hide modal
          handleClose();
        }
      } else {
        // Creating a new person
        const response = await axios.post(`${process.env.REACT_APP_URL}/createperson`, values, {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          const newPerson = response.data.person;
  
          // Check if an image was provided, then upload the image
          if (values.imgFile) {
            const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${newPerson._id}`, 'image/png');
            await uploadToPresignedUrl(presignedUrl, values.imgFile, 'image/png');
            const filePath = getFilePathFromUrl(presignedUrl);
  
            // Now update the person with the imgUrl
            const updateResponse = await axios.post(`${process.env.REACT_APP_URL}/update-person/${newPerson._id}`, {
              imgUrl: { key, url: filePath }
            }, {
              withCredentials: true
            });
  
            if (updateResponse.status === 200) {
              newPerson.imgUrl = { key, url: filePath }; // Update the newPerson object with the imgUrl
            }
          }
  
          // Update the UI
          hideModal();
          updatePerson((prevState) => {
            // Ensure peopleByCrew exists in the previous state
            if (!prevState.peopleByCrew) {
              prevState = { ...prevState, peopleByCrew: [] };
            }
          
            // Check if the person is being added to the "Unassigned" crew by name
            const isUnassignedCrew = newPerson.crew === "Unassigned";
          
            // Create a flag to indicate if the crew already exists
            let crewExists = false;
          
            // Update the crew if it already exists, otherwise, prepare to add a new one
            const updatedPeopleByCrew = prevState.peopleByCrew.map((crew) => {
              // Check if it's the correct crew to update based on id or "Unassigned" name
              if (crew._id === newPerson.crew || (isUnassignedCrew && crew.name === "Unassigned")) {
                crewExists = true;
                return {
                  ...crew,
                  people: [...crew.people, newPerson],
                };
              }
              return crew;
            });
          
            // If the crew doesn't exist, add it as a new crew entry
            if (!crewExists) {
              updatedPeopleByCrew.push({
                _id: isUnassignedCrew ? "unassigned_id" : newPerson.crew, // Use a default id if Unassigned
                name: isUnassignedCrew ? "Unassigned" : newPerson.crew,
                people: [newPerson],
              });
            }
          
            // Return the updated state with the updated peopleByCrew
            return {
              ...prevState,
              peopleByCrew: updatedPeopleByCrew,
            };
          });
  
          const crewName = values.crew ? crews.find(crew => crew._id === values.crew)?.name || 'Unassigned' : 'Unassigned';
          addToast('Person Created!', `Success! "${values.firstName} ${values.lastName}" has been added to "${crewName}"`, 'success', 'white');
          handleClose();
        } else {
          console.error('Failed to create person');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      addToast('Error!', 'Failed to create/update person due to a network error. Please try again.', 'danger', 'white');
    } finally {
      setShowSpinner(false);
    }
  };

  const imgUrl = person?.imgUrl;
  return (
    <div data-testid="add-or-edit-person-modal">
      <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
    >
      <Modal.Header className="modal-header" closeButton>
        <Modal.Title>{title} Person</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={Yup.object({
            firstName: Yup.string().max(30, 'Must be 30 characters or less').required('First Name is required'),
            lastName: Yup.string().max(30, 'Must be 30 characters or less').required('Last Name is required'),
            phone: Yup.string()
              .matches(phoneRegExp, 'Phone number is not valid')
              .required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            address: Yup.string()
              .min(5, 'Address must be at least 5 characters long')
              .max(100, 'Address must be 100 characters or less')
              .required('Address is required'),
            dob: Yup.date()
              .max(subYears(new Date(), 18), 'You must be at least 18 years old') // Minimum age of 18
              .required('Date of Birth is required')
              .nullable(), // Allow empty value until it's filled
            startDate: Yup.date()
              .max(new Date(), 'Start Date cannot be in the future') // Ensures the date is not in the future
              .required('Start Date is required')
              .nullable(), // Allows empty value initially
            contact: Yup.string().max(30, 'Must be 30 characters or less').required('Contact is required'),
            contactphone: Yup.string()
              .matches(phoneRegExp, 'Contact phone number is not valid')
              .required('Contact phone number is required'),
            doctor: Yup.string().max(30, 'Must be 30 characters or less').required('Doctor is required'),
          })}
          onSubmit={(values, {resetForm}) => {
            handleSubmit(values, resetForm);
          }}
        >
          {({ setFieldValue, values, touched, errors, handleSubmit, getFieldProps, resetForm}) => (
            <Form>
              <Form.Group className="row g-3">
                <Form.Label style={{ fontSize: '1.2rem' }}>Contact Info:</Form.Label>
                <Form.Group className="col-md-3">
                  <Form.Label htmlFor="imgurl" className="image-container">
                    <Image
                      // eslint-disable-next-line no-undef
                      src={values?.imgPreview || imgUrl?.url || '/img/default.jpg'}
                      className="figure-img img-fluid z-depth-1 rounded mb-0 border border-dark"
                      alt="..."
                      id="img-preview"
                      style={{ width: '163px', height: '163px', objectFit: 'cover' }} // Adjust width and height as needed

                    />
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Upload image</Tooltip>}>
                      <div className="image-overlay">Upload image</div>
                    </OverlayTrigger>
                    <Form.Control
                      type="file"
                      id="imgurl"
                      name="imgFile"
                      size="sm"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        const file = event.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setFieldValue('imgPreview', e.target.result);
                            setFieldValue('imgFile', file);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Label>
                  <InputWithLabel
                    type={'date'}
                    label={'Start Date'}
                    name={'startDate'}
                  />
                  <Form.Label htmlFor="roleInput" className="form-label">
                    Crew
                  </Form.Label>
                  <Form.Select
                    id="crewInput"
                    name="crew"
                    {...getFieldProps('crew')}
                    isInvalid={touched.crew && errors.crew}
                  >
                    <option value="" disabled>Select Crew</option>
                    {crews && crews.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                    <option value={undefined}>Unassigned</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="col-md-4">
                <InputWithLabel
                  type={'text'}
                  label={'First Name'}
                  name={'firstName'}
                />
                <InputWithLabel
                  type={'text'}
                  label={'Last Name'}
                  name={'lastName'}
                />
                <InputWithLabel
                  type={'text'}
                  label={'Home Address'}
                  name={'address'}
                />
                <SelectRoleType name="role"/>
              </Form.Group>

              <Form.Group className="col-md-5">
              <InputWithLabel
                type={'tel'}
                label={'Phone Number'}
                name={'phone'}
              />
              <InputWithLabel
                type={'email'}
                label={'Email Address'}
                name={'email'}
              />
              <InputWithLabel
                type={'date'}
                label={'Date of Birth'}
                name={'dob'}
              />
              <InputWithLabel
                type={'text'}
                label={'Doctor'}
                name={'doctor'}
              />
            </Form.Group>

            <Form.Group className="col-md-12">
              <InputWithLabelMulti
                label={'Medical Issues'}
                name={'medical'}
                rows={3} // Number of rows for the textarea
                placeholder="Describe any medical issues here..."
              />
            </Form.Group>

            <Form.Group className="col-md-5">
              <InputWithLabel
                type={'text'}
                label={'Parnter Contact Name'}
                name={'contact'}
              />
            </Form.Group>

            <Form.Group className="col-md-5">
              <InputWithLabel
                  type={'tel'}
                  label={'Parnter Contact Number'}
                  name={'contactphone'}
                />              
            </Form.Group>
            <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

            <Form.Group className="col-md-12">
                <Form.Check
                  type="checkbox"
                  label={`Archive ${values.firstName} ${values.lastName}`}
                  checked={values.archive || false}
                  onChange={() => setFieldValue('archive', !values.archive)}
                />
            </Form.Group>
            
            </Form.Group>
            <Form.Group className="text-end mt-3">
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
            </Form.Group>
          </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
    </div>
  );
};

AddOrEditPersonModal.propTypes = {
  _account: PropTypes.number.isRequired,
  person: PropTypes.object,
  show: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  updatePerson: PropTypes.func,
  crews: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
}

export default AddOrEditPersonModal;
