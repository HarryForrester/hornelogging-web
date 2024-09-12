/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
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

const AddOrEditPersonModal = ({_account, person, updatePerson, show, hideModal, crews, title, edit}) => {
  console.log('haha crews', crews);
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

  const handleClose = () => {
    hideModal();
  };

  const handleSubmit = async (values) => {
    console.log('handleSubmit');
    setShowSpinner(true);
  
    try {
      if (edit) {
        // Editing an existing person
        let response;
  
        if (values.imgFile) {
          console.log('formState.imgFile', values.imgFile);
          // Upload new image and update with imgUrl
          const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${values.id}`, 'image/png');
          await uploadToPresignedUrl(presignedUrl, values.imgFile, 'image/png');
          const filePath = getFilePathFromUrl(presignedUrl);
  
          values.imgUrl = { key: key, url: filePath }; // Add new imgUrl to the updated form state
        } else {
          console.log('without img change');
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
          hideModal(); // Hide modal
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
            if (!prevState.peopleByCrew) {
              prevState = { ...prevState, peopleByCrew: [] };
            }
  
            const updatedPeopleByCrew = prevState.peopleByCrew.map((crew) => {
              if (crew._id === newPerson.crew) {
                return {
                  ...crew,
                  people: [...crew.people, newPerson],
                };
              }
              return crew;
            });
  
            if (!prevState.peopleByCrew.some((crew) => crew._id === newPerson.crew)) {
              updatedPeopleByCrew.push({
                name: newPerson.crew,
                people: [newPerson],
              });
            }
  
            return {
              ...prevState,
              peopleByCrew: updatedPeopleByCrew,
            };
          });
  
          const crewName = values.crew ? crews.find(crew => crew._id === values.crew)?.name || 'Unassigned' : 'Unassigned';
          addToast('Add Person', `Success! "${values.firstName} ${values.lastName}" has been added to "${crewName}"`, 'success', 'white');
        } else {
          console.error('Failed to create person');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      addToast('Error', 'An error occurred. Please try again later.', 'danger', 'white');
    } finally {
      setShowSpinner(false);
    }
  };

  const imgUrl = person?.imgUrl;
  return (
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
          onSubmit={(values) => {
            console.log('fuck')
            handleSubmit(values);
          }}
        >
          {({ setFieldValue, values, touched, errors, handleSubmit, getFieldProps}) => (
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
                  label={'Address'}
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
