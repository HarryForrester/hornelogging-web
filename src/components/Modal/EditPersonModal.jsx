import React, { useState, useEffect } from 'react';
import SelectRoleType from '../SelectList/SelectRoleType';
import InputWithLabel from '../Input/InputWithLabel';
import SelectWithLabel from '../Select/SelectWithLabel';
import axios from 'axios';
import { Button, Form, Image, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { usePersonData } from '../PersonData';
import { useAlertMessage } from '../AlertMessage';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { getPresignedUrl, uploadToPresignedUrl } from '../../hooks/useFileUpload';
const EditPersonModal = (_account) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { personDataState, setPersonDataState } = usePersonData();
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const person = personDataState?.person;
  const [formState, setFormState] = useState({
    id: '',
    name: '',
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

  useEffect(() => {
    setFormState({
      id: person?._id,
      name: person?.name,
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
  }, [person]);

  const updatePerson = (updatedPerson) => {
    setPersonDataState((prevState) => ({
      ...prevState,
      person: {
        ...prevState.person,
        ...updatedPerson
      }
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setFormState({ ...formState, imgPreview: e.target.result, imgFile: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
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
  };

  const handleCrewChange = (e) => {
    setFormState({ ...formState, crew: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormState({ ...formState, role: e.target.value });
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      isEditPersonModalVisible: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    console.log('meme was here', formState)

    const id = new Date().getTime();
    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

   /*  if (formState.imgFile) {
      formData.append('fileupload', formState.imgFile, 'fileupload');
    } */

    const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${formState.id}`)
    await uploadToPresignedUrl(presignedUrl, formState.imgFile);
    formData.append('imgUrl', presignedUrl);

    try {
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        process.env.REACT_APP_URL + '/update-person/' + formState.id,
        formData,
        {
          withCredentials: true,
          
        }
      );

      if (response.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Person Updated',
              show: true,
              message: `Success! ${formState.name} has been updated from ${formState.crew}`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        updatePerson(formState);
        resetForm();
        setSkidModalState((prevState) => ({
          ...prevState,
          isEditPersonModalVisible: false
        }));
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Update Person',
            show: true,
            message: `Error! Updating ${formState.name}  from ${formState.crew}`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error:', error);
    } finally {
      setShowSpinner(false);
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    } 
  };

  const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };

  return (
    <Modal
      show={skidModalState.isEditPersonModalVisible}
      onHide={handleClose}
      size="xl"
      backdrop="static"
    >
      <Modal.Header className="modal-header" closeButton>
        <Modal.Title>Edit Person</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="row g-4">
            <Form.Group className="col-md-3">
              <Form.Label htmlFor="imgurl" className="image-container">
                <Image
                  // eslint-disable-next-line no-undef
                  src={formState?.imgPreview || process.env.REACT_APP_URL + '/' + person?.imgUrl}
                  className="figure-img img-fluid z-depth-1 rounded mb-0 border border-dark"
                  alt="..."
                  id="img-preview"
                />
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Upload image</Tooltip>}>
                  <div className="image-overlay">Upload image</div>
                </OverlayTrigger>
                <Form.Control
                  type="file"
                  id="imgurl"
                  name="fileupload"
                  size="sm"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </Form.Label>
            </Form.Group>

            <Form.Group className="col-md-5">
              <InputWithLabel
                type={'text'}
                label={'Name'}
                name={'name'}
                value={formState.name}
                onChange={(value) => handleInputChange('name', value)}
              />
              <InputWithLabel
                type={'tel'}
                label={'Phone Number'}
                name={'phone'}
                value={formState.phone}
                onChange={(value) => handleInputChange('phone', value)}
              />
              <InputWithLabel
                type={'email'}
                label={'Email Address'}
                name={'email'}
                value={formState.email}
                onChange={(value) => handleInputChange('email', value)}
              />
              <InputWithLabel
                type={'text'}
                label={'Parnter Contact Name'}
                name={'contact'}
                value={formState.contact}
                onChange={(value) => handleInputChange('contact', value)}
              />
            </Form.Group>

            <Form.Group className="col-md-4">
              <InputWithLabel
                type={'text'}
                label={'Address'}
                name={'address'}
                value={formState.address}
                onChange={(value) => handleInputChange('address', value)}
              />
              <InputWithLabel
                type={'date'}
                label={'Date of Birth'}
                name={'dob'}
                value={formState.dob}
                onChange={(value) => handleInputChange('dob', value)}
              />
              <InputWithLabel
                type={'date'}
                label={'Start Date'}
                name={'startDate'}
                value={formState.startDate}
                onChange={(value) => handleInputChange('startDate', value)}
              />
              <InputWithLabel
                type={'tel'}
                label={'Parnter Contact Number'}
                name={'contactphone'}
                value={formState.contactphone}
                onChange={(value) => handleInputChange('contactphone', value)}
              />
            </Form.Group>

            <Form.Group className="col-md-5">
              <Form.Label htmlFor="roleInput" className="form-label">
                Crew
              </Form.Label>
              <Form.Select
                id="crewInput"
                name="crew"
                value={formState.crew || 'Unassigned'}
                onChange={handleCrewChange}
                required
              >
                <option value="Unassigned" disabled>
                  Select Crew
                </option>
                {personDataState &&
                  personDataState.crewTypes &&
                  personDataState.crewTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <SelectRoleType
              onChange={handleRoleChange}
              selectedRole={formState.role}
              key={formState.role}
            />
            <Form.Group className="col-md-1">
              <div style={{ paddingTop: '30px' }}>
                <Form.Check
                  type="checkbox"
                  label="Archive"
                  checked={formState.archive ? JSON.parse(formState.archive) : false}
                  onChange={(e) => handleInputChange('archive', e.target.checked)}
                />
              </div>
            </Form.Group>

            <Form.Group className="col-md-6">
              <InputWithLabel
                type={'text'}
                label={'Doctor'}
                name={'doctor'}
                value={formState.doctor}
                onChange={(value) => handleInputChange('doctor', value)}
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <InputWithLabel
                type={'text'}
                label={'Medical Issues'}
                name={'medical'}
                value={formState.medical}
                onChange={(value) => handleInputChange('medical', value)}
              />
            </Form.Group>
          </Form.Group>

          <Modal.Footer className="modal-footer">
            <Button type="submit" variant="secondary">
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
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPersonModal;
