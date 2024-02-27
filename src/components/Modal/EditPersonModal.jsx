import React, { useState, useEffect
 } from 'react';
import SelectRoleType from '../SelectList/SelectRoleType';
import InputWithLabel from '../Input/InputWithLabel';
import SelectWithLabel from '../Select/SelectWithLabel';
import axios from 'axios';
import { Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { usePersonData } from '../PersonData';
import { useAlertMessage } from '../AlertMessage';

const EditPersonModal = () => {
    const { skidModalState, setSkidModalState } = useSkidModal();
    const { personDataState, setPersonDataState } = usePersonData();
    const { mapState, setMapState }  = useMap();
    const { alertMessageState, setAlertMessageState } = useAlertMessage();
    const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
    const person = personDataState.person;
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
    });

    useEffect(() => {
        setFormState({
            id: person._id,
            name: person.name,
            crew: person.crew,
            role: person.role,
            phone: person.phone,
            email: person.email,
            address: person.address,
            dob: person.dob,
            startDate: person.startDate,
            contact: person.contact,
            contactphone: person.contactphone,
            doctor: person.doctor,
            medical: person.medical,
            imgPreview: '',
        });
    }, [person]);

    const updatePerson = (updatedPerson) => {
        setPersonDataState((prevState) => ({
            ...prevState,
            person: {
                ...prevState.person,
                ...updatedPerson,
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
        });
    };

    const handleCrewChange = (e) => {
        setFormState({ ...formState, crew: e.target.value });
    };

    const handleRoleChange = (e) => {
        setFormState({ ...formState, role: e.target.value });
    }

    const handleClose = () => {
        setSkidModalState((prevState) => ({
            isEditPersonModalVisible: false
        }))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowSpinner(true);

        const id = new Date().getTime(); 
        const formData = new FormData();

        Object.entries(formState).forEach(([key, value]) => {
            formData.append(key, value);
        });        

        if (formState.imgFile) {
            formData.append('fileupload', formState.imgFile, 'fileupload');
        }
    
        try {
            const response = await axios.post(
                process.env.REACT_APP_URL + '/update-person/' + formState.id,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.status === 200) {
                setAlertMessageState((prevState) => ({
                    ...prevState,
                    toasts: [
                      ...prevState.toasts,
                      {
                        id: id,
                        heading: "Person Updated",
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
                    isEditPersonModalVisible: false,
                }));

            } else {
                alert("An Error has occurred. Please try again.");
            }
    
        } catch (error) {
            setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: [
                  ...prevState.toasts,
                  {
                    id: id,
                    heading: "Update Person",
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
                  toasts: prevState.toasts.filter((toast) => toast.id !== id),
              }));
              }, 10000)
        }
    };

    const handleInputChange = (name, value) => {
        setFormState({ ...formState, [name]: value });
    };

    return (
        <Modal show={skidModalState.isEditPersonModalVisible} onHide={handleClose} backdrop="static">
            <Modal.Header className="modal-header" closeButton>
                <Modal.Title>Edit Person</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="row g-3">
                        <fieldset>
                            <legend>Employee Details</legend>
                        </fieldset>

                        <Form.Group className="col-md-5">
                            <Form.Label htmlFor="imgurl">
                                <Image
                                    src={formState.imgPreview || process.env.REACT_APP_URL + "/" + person.imgUrl}
                                    className="figure-img img-fluid z-depth-1 rounded mb-0 border border-dark"
                                    alt="..."
                                    style={{ width: '128px' }}
                                    id="img-preview"
                                />
                            </Form.Label>
                            <Form.Control
                                type="file"
                                id="imgurl"
                                name="fileupload"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"text"} label={"Name"} name={"name"} value={formState.name} onChange={(value) => handleInputChange('name', value)} />
                            <br />
                            <InputWithLabel type={"tel"} label={"Phone Number"} name={"phone"} value={formState.phone} onChange={(value) => handleInputChange('phone', value)} />
                            <br />
                            <InputWithLabel type={"email"} label={"Email Address"} name={"email"} value={formState.email} onChange={(value) => handleInputChange('email', value)} />
                        </Form.Group>

                        <InputWithLabel type={"text"} label={"Address"} name={"address"} value={formState.address} onChange={(value) => handleInputChange('address', value)} />

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"date"} label={"Date of Birth"} name={"dob"} value={formState.dob} onChange={(value) => handleInputChange('dob', value)} />
                        </Form.Group>

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"date"} label={"Start Date"} name={"startDate"} value={formState.startDate} onChange={(value) => handleInputChange('startDate', value)} />
                        </Form.Group>

                        <fieldset>
                            <legend>Parnter / Contact Info</legend>
                        </fieldset>

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"text"} label={"Contact Name"} name={"contact"} value={formState.contact} onChange={(value) => handleInputChange('contact', value)} />
                        </Form.Group>

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"tel"} label={"Contact Number"} name={"contactphone"} value={formState.contactphone} onChange={(value) => handleInputChange('contactphone', value)} />
                        </Form.Group>

                        <fieldset>
                            <legend>Job Description / Medical Info</legend>
                        </fieldset>

                        <Form.Group className="col-md-6">
{/*                             <SelectWithLabel htmlFor={"crewInput"} id={"crewInput"} label={"Crew"} name={"crew"} value={formState.crew} onChange={handleCrewChange} crewTypes={personDataState.crewTypes} />
 */}                            <Form.Label htmlFor="roleInput" className="form-label">
                                Crew
                            </Form.Label>
                            <Form.Select
                                id="crewInput"
                                name="crew"
                                value={formState.crew || "Unassigned"}
                                onChange={handleCrewChange}
                                required
                            >
                                <option value="Unassigned" disabled>Select Crew</option>
                                {personDataState.crewTypes.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <SelectRoleType onChange={handleRoleChange} selectedRole={formState.role} key={formState.role} />

                        <Form.Group className="col-md-6">
                            <InputWithLabel type={"text"} label={"Doctor"} name={"doctor"} value={formState.doctor} onChange={(value) => handleInputChange('doctor', value)} />
                        </Form.Group>

                        <Form.Group className="col-md-12">
                            <InputWithLabel type={"text"} label={"Medical Issues"} name={"medical"} value={formState.medical} onChange={(value) => handleInputChange('medical', value)} />
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
                            ): (
                                "Save changes"
                            )}
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default EditPersonModal;
