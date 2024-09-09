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

const EditPersonModal = ({_account, person, updatePerson, show, hideModal, crews}) => {
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
  /* const [formState, setFormState] = useState({
    id: '',
    firstName: '',
    lastName: '',
    crew: '',
    role: '',
    phone: '',
    email: '',
    address: '',
    dob: '',
    startDate: '',
    contact: '',
    contactphone: '',
    doctor: '',
    medical: '',
    imgPreview: '',
    archive: ''
  }); */

 /*  useEffect(() => {
    setFormState({
      id: person?._id,
      firstName: person?.firstName,
      lastName: person?.lastName,
      crew: person?.crew,
      role: person?.role,
      phone: person?.phone,
      email: person?.email,
      address: person?.address,
      dob: person?.dob,
      startDate: person?.startDate,
      contact: person?.contact,
      contactphone: person?.contactphone,
      doctor: person?.doctor,
      medical: person?.medical,
      imgPreview: person?.imgPreview,
      archive: person?.archive
    });
  }, [person]); */

 /*  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log('file', file);
    reader.onload = (e) => {
      setFormState({ ...formState, imgPreview: e.target.result, imgFile: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }; */

/*   const resetForm = () => {
    setFormState({
      id: '',
      firstName: '',
      lastName: '',
      crew: '',
      role: '',
      phone: '',
      email: '',
      address: '',
      dob: '',
      startDate: '',
      contact: '',
      contactphone: '',
      doctor: '',
      medical: '',
      imgPreview: '',
      archive: ''
    });
  }; */
/* 
  const handleCrewChange = (e) => {
    setFormState({ ...formState, crew: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormState({ ...formState, role: e.target.value });
  }; */

  const handleClose = () => {
    hideModal();
  };

  const handleSubmit = async (values) => {
    console.log('handleSubmit');
    setShowSpinner(true);
  
    try {
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
        //resetForm(); // Reset form fields
        hideModal(); // Hide modal
      }
    } catch (error) {
      addToast('Update Person!', `Error! An error occurred while updating ${values.firstName} ${values.lastName}. Please try again later`, 'danger', 'white');
      console.error('Error:', error);
    } finally {
      setShowSpinner(false);
    }
  };
  

  /* const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };
 */
  const imgUrl = person?.imgUrl;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
    >
      <Modal.Header className="modal-header" closeButton>
        <Modal.Title>Edit Person</Modal.Title>
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
          {({ setFieldValue, values, handleSubmit, resetForm}) => (
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
                  >
                    <option value="default" disabled>
                      Select Crew
                    </option>
                    {crews && crews.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    <option value="Unassigned">
                      Unassigned
                    </option>
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

EditPersonModal.propTypes = {
  _account: PropTypes.number.isRequired,
  person: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  updatePerson: PropTypes.func.isRequired,
  crews: PropTypes.array.isRequired
}

export default EditPersonModal;
