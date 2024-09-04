/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import SelectRoleType from '../SelectList/SelectRoleType';
import InputWithLabel from '../Input/InputWithLabel';
import axios from 'axios';
import { Button, Form, Image, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl } from '../../hooks/useFileUpload';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import { useCrews } from '../../context/CrewContext';
import PropTypes from 'prop-types';
const EditPersonModal = ({_account, person, updatePerson, show, hideModal}) => {
  const { crews } = useCrews();
  const { addToast } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
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
    hideModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
  
    try {
      let response;
      if (formState.imgFile) {
        // Upload new image and update with imgUrl
        const [presignedUrl, key] = await getPresignedUrl(`${_account._account}/person/${formState.id}`, 'image/png');
        await uploadToPresignedUrl(presignedUrl, formState.imgFile, 'image/png');
        const filePath = getFilePathFromUrl(presignedUrl);
  
        response = await axios.post(
          `${process.env.REACT_APP_URL}/update-person/${formState.id}`,
          {
            ...formState,
            imgUrl: { key: key, url: filePath }
          },
          { withCredentials: true }
        );
      } else {
        // Update without changing the imgUrl
        response = await axios.post(
          `${process.env.REACT_APP_URL}/update-person/${formState.id}`,
          { ...formState },
          { withCredentials: true }
        );
      }
  
      if (response.status === 200) {
        // Delete old profile image if it exists
        if (person.imgUrl) {
          await deletePresignedUrl([person.imgUrl.key]);
        }        
        addToast('Person Updated!', `Success! ${formState.name} has been updated`, 'success', 'white');
        updatePerson(response.data.updatedPerson); // Update person data in UI
        resetForm(); // Reset form fields
        hideModal(); // Hide modal
      }
    } catch (error) {
      addToast('Update Person!', `Error!, Error occcured while updating ${formState.name}. Please try again later`, 'danger', 'white');
      console.error('Error:', error);
    } finally {
      setShowSpinner(false);
    }
  };
  

  const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
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
        <Modal.Title>Edit Person</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="row g-4">
            <Form.Group className="col-md-3">
              <Form.Label htmlFor="imgurl" className="image-container">
                <Image
                  // eslint-disable-next-line no-undef
                  src={formState?.imgPreview || imgUrl?.url || '/img/default.jpg'}
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
                value={formState.crew || 'default'}
                onChange={handleCrewChange}
                required
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

EditPersonModal.propTypes = {
  _account: PropTypes.number.isRequired,
  person: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  updatePerson: PropTypes.func.isRequired,
}

export default EditPersonModal;
